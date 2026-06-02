from __future__ import annotations

import logging
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .model_service import get_model_bundle
from .routes.dataset import router as dataset_router
from .routes.faq import router as faq_router
from .routes.metrics import router as metrics_router
from .routes.prediction import router as prediction_router
from .schemas import HealthResponse


logger = logging.getLogger(__name__)


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
    try:
        app.state.model_bundle = get_model_bundle()
    except Exception:
        app.state.model_bundle = None
        logger.exception("Failed to load model artifact during startup")


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
