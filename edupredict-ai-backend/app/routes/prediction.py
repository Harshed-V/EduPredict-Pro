from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request

from ..model_service import predict
from ..schemas import PredictionRequest, PredictionResponse

router = APIRouter(prefix="/api", tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict_endpoint(request: PredictionRequest, app_request: Request) -> PredictionResponse:
    bundle = getattr(app_request.app.state, "model_bundle", None)
    if bundle is None:
        raise HTTPException(status_code=503, detail="Model bundle is not loaded")

    try:
        result = predict(
            bundle,
            {
                "studyHours": request.study_hours,
                "attendance": request.attendance,
                "motivation": request.motivation,
                "assignment": request.assignment_completion,
                "courses": request.online_courses,
                "stress": request.stress_level,
            },
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return PredictionResponse(**result)
