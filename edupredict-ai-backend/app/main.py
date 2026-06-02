from __future__ import annotations

import logging
import os
from pathlib import Path

from fastapi import FastAPI
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
logger = logging.getLogger(__name__)


def _resolve_artifact_path() -> Path | None:
    env_path = os.getenv("MODEL_ARTIFACT_PATH")
    if env_path:
        candidate = Path(env_path)
        if candidate.exists():
            return candidate
        logger.warning("MODEL_ARTIFACT_PATH was set but not found: %s", candidate)

    for candidate in (ARTIFACT_PATH, LEGACY_ARTIFACT_PATH):
        if candidate.exists():
            return candidate

    return None


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    artifact_path = _resolve_artifact_path()
    if artifact_path is None:
        app.state.model_bundle = None
        logger.warning(
            "No model artifact found. Set MODEL_ARTIFACT_PATH or deploy an artifact under %s.",
            PROJECT_ROOT / "artifacts",
        )
        return

    try:
        app.state.model_bundle = load_bundle(artifact_path)
    except Exception:
        app.state.model_bundle = None
        logger.exception("Failed to load model artifact from %s", artifact_path)


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
