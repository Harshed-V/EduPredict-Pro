from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import AliasChoices, BaseModel, Field



class PredictionRequest(BaseModel):
    study_hours: float = Field(validation_alias=AliasChoices("StudyHours", "studyHours"), ge=0)
    attendance: float = Field(validation_alias=AliasChoices("Attendance", "attendance"), ge=0)
    motivation: Any = Field(validation_alias=AliasChoices("Motivation", "motivation"))
    assignment_completion: float = Field(validation_alias=AliasChoices("AssignmentCompletion", "assignment"), ge=0)
    online_courses: float = Field(validation_alias=AliasChoices("OnlineCourses", "courses"), ge=0)
    stress_level: float = Field(validation_alias=AliasChoices("StressLevel", "stress"), ge=0)


class ClassProbability(BaseModel):
    grade_class: int
    probability: float


class PredictionResponse(BaseModel):
    predicted_class: int
    predicted_class_label: str
    prediction: str
    predicted_score: int
    confidence: float
    confidence_label: str
    peer_percentile: str
    performance_category: str
    recommendation: str
    interpretation: str
    probabilities: List[ClassProbability]
    normalized_features: Dict[str, int]
    model_accuracy: float
    feature_importance: Dict[str, float]


class MetricValue(BaseModel):
    precision: float
    recall: float
    f1_score: float
    support: int


class BenchmarkEntry(BaseModel):
    name: str
    accuracy: float
    train_time: str
    status: str


class MetricsResponse(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    feature_importance: Dict[str, float]
    classes: List[int]
    class_metrics: Dict[str, MetricValue]
    benchmarks: List[BenchmarkEntry]


class HealthResponse(BaseModel):
    status: str
    model_ready: bool
    model_accuracy: float | None = None
    model_precision: float | None = None
    model_recall: float | None = None
    model_f1_score: float | None = None


class FaqRequest(BaseModel):
    question: str
    studyHours: Optional[float] = None
    attendance: Optional[float] = None
    motivation: Optional[str] = None
    assignment: Optional[float] = None
    courses: Optional[float] = None
    stress: Optional[float] = None


class FaqResponse(BaseModel):
    question: str
    answer: str
    matched_topic: Optional[str] = None
    suggestions: List[str] = Field(default_factory=list)

