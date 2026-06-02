from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from ..model_service import ModelBundle, get_model_bundle
from ..schemas import MetricsResponse
from ..services.metrics_service import get_metrics

router = APIRouter(prefix="/api", tags=["metrics"])


@router.get("/metrics", response_model=MetricsResponse)
def metrics_endpoint(app_request: Request) -> MetricsResponse:
    bundle = getattr(app_request.app.state, "model_bundle", None) or get_model_bundle()
    if bundle is None:
        raise HTTPException(status_code=503, detail="Model bundle is not loaded")
    app_request.app.state.model_bundle = bundle
    return MetricsResponse(**get_metrics(bundle))
