from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATASET_PATH = PROJECT_ROOT / "student_performance.csv"

router = APIRouter(prefix="/api", tags=["dataset"])


@router.get("/dataset/download")
def download_dataset():
    """Download the student performance dataset as CSV."""
    if not DATASET_PATH.exists():
        return {"error": "Dataset not found"}
    
    return FileResponse(
        path=DATASET_PATH,
        filename="student_performance.csv",
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=student_performance.csv"}
    )
