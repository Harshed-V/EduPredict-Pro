from __future__ import annotations

import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = Path(__file__).resolve().parents[1]
DATASET_PATH = PROJECT_ROOT / "student_performance.csv"
ARTIFACTS_DIR = BACKEND_ROOT / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "student_model.pkl"
JOBLIB_MODEL_PATH = ARTIFACTS_DIR / "edupredict_model.joblib"
METADATA_PATH = ARTIFACTS_DIR / "metadata.json"

FEATURE_NAMES = [
    "StudyHours",
    "Attendance",
    "Motivation",
    "AssignmentCompletion",
    "OnlineCourses",
    "StressLevel",
]


def train_model() -> dict:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    if "ExamScore" in df.columns:
        df = df.drop("ExamScore", axis=1)
    df = df.drop_duplicates()

    x = df[FEATURE_NAMES]
    y = df["FinalGrade"]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
    )

    model = RandomForestClassifier(random_state=42)
    model.fit(x_train, y_train)
    prediction = model.predict(x_test)

    accuracy = float(accuracy_score(y_test, prediction))
    report = classification_report(y_test, prediction, output_dict=True)
    matrix = confusion_matrix(y_test, prediction).tolist()
    macro_precision = float(report["macro avg"]["precision"])
    macro_recall = float(report["macro avg"]["recall"])
    macro_f1 = float(report["macro avg"]["f1-score"])
    feature_importance = {
        feature: float(importance)
        for feature, importance in zip(FEATURE_NAMES, model.feature_importances_)
    }

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    bundle = {
        "model": model,
        "feature_names": FEATURE_NAMES,
        "accuracy": accuracy,
        "feature_importance": feature_importance,
        "classes": [int(value) for value in model.classes_],
        "report": report,
        "confusion_matrix": matrix,
        "precision": macro_precision,
        "recall": macro_recall,
        "f1_score": macro_f1,
        "class_labels": [int(value) for value in sorted(df["FinalGrade"].unique())],
    }

    joblib.dump(bundle, MODEL_PATH)
    joblib.dump(bundle, JOBLIB_MODEL_PATH)
    metadata = {
        "dataset_path": str(DATASET_PATH),
        "model_path": str(MODEL_PATH),
        "feature_names": FEATURE_NAMES,
        "accuracy": accuracy,
        "precision": macro_precision,
        "recall": macro_recall,
        "f1_score": macro_f1,
        "classes": [int(value) for value in model.classes_],
        "class_labels": [int(value) for value in sorted(df["FinalGrade"].unique())],
        "report": report,
        "confusion_matrix": matrix,
        "feature_importance": feature_importance,
    }
    METADATA_PATH.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata


def main() -> None:
    metadata = train_model()
    print(f"Saved model to {MODEL_PATH}")
    print(f"Accuracy: {metadata['accuracy']:.4f}")


if __name__ == "__main__":
    main()
