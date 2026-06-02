from fastapi import APIRouter, Request

from ..model_service import get_model_bundle
from ..schemas import FaqRequest, FaqResponse
from ..services.faq_service import answer_question

router = APIRouter(prefix="/api", tags=["faq"])


@router.post("/faq", response_model=FaqResponse)
def faq_endpoint(request: Request, faq_req: FaqRequest) -> FaqResponse:
    bundle = getattr(request.app.state, "model_bundle", None) or get_model_bundle()
    if bundle is not None:
        request.app.state.model_bundle = bundle

    # Extract feature values from payload if they are supplied
    features = {
        "studyHours": faq_req.studyHours,
        "attendance": faq_req.attendance,
        "motivation": faq_req.motivation,
        "assignment": faq_req.assignment,
        "courses": faq_req.courses,
        "stress": faq_req.stress,
    }

    answer, topic, suggestions = answer_question(
        faq_req.question, bundle=bundle, features=features
    )

    return FaqResponse(
        question=faq_req.question,
        answer=answer,
        matched_topic=topic,
        suggestions=suggestions,
    )

