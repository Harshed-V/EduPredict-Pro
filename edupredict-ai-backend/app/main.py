from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .model_service import load_bundle
from .routes.dataset import router as dataset_router
from .routes.faq import router as faq_router
from .routes.metrics import router as metrics_router
from .routes.prediction import router as prediction_router
from .schemas import HealthResponse


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_PATH = PROJECT_ROOT / "artifacts" / "student_model.pkl"
LEGACY_ARTIFACT_PATH = PROJECT_ROOT / "artifacts" / "edupredict_model.joblib"


app = FastAPI(title="EduPredict AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)
app.include_router(metrics_router)
app.include_router(faq_router)
app.include_router(dataset_router)


@app.on_event("startup")
def _load_model() -> None:
    artifact_path = ARTIFACT_PATH if ARTIFACT_PATH.exists() else LEGACY_ARTIFACT_PATH
    app.state.model_bundle = load_bundle(artifact_path)


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    bundle = getattr(app.state, "model_bundle", None)
    return HealthResponse(
        status="ok",
        model_ready=bundle is not None,
        model_accuracy=getattr(bundle, "accuracy", None),
        model_precision=getattr(bundle, "precision", None),
        model_recall=getattr(bundle, "recall", None),
        model_f1_score=getattr(bundle, "f1_score", None),
    )
