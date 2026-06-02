from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = Path(__file__).resolve().parents[2]
DATASET_CANDIDATES = (
    BACKEND_ROOT / "student_performance.csv",
    PROJECT_ROOT / "student_performance.csv",
)

router = APIRouter(prefix="/api", tags=["dataset"])


@router.get("/dataset/download")
def download_dataset():
    """Download the student performance dataset as CSV."""
    dataset_path = next((path for path in DATASET_CANDIDATES if path.exists()), None)
    if dataset_path is None:
        return {"error": "Dataset not found"}

    return FileResponse(
        path=dataset_path,
        filename="student_performance.csv",
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=student_performance.csv"},
    )
