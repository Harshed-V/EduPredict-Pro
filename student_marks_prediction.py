import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("student_performance.csv")

# Remove duplicates
df.drop_duplicates(inplace=True)

# Features
X = df.drop(["FinalGrade", "ExamScore"], axis=1)

# Target
y = df["FinalGrade"]

# Split
x_train, x_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

# Train
model.fit(x_train, y_train)

# Predict
predictions = model.predict(x_test)

# Accuracy
accuracy = accuracy_score(y_test, predictions)

print("Accuracy:", accuracy)

# Save model
joblib.dump(model, "student_grade_model.pkl")

print("Model saved successfully")