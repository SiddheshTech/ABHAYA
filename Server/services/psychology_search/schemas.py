from pydantic import BaseModel
from typing import List, Dict, Any

class PerpetratorProfileInput(BaseModel):
    current_case_id: str
    observed_tactics: List[str]

class PerpetratorProfileResponse(BaseModel):
    insight: str
    suggested_previous_cases: List[str]
    confidence: float

class CognitiveMapInput(BaseModel):
    center_lat: float
    center_lng: float
    radius_km: float
    child_profile: str # e.g. "Autistic", "ADHD", "Runaway"

class PredictedPathPoint(BaseModel):
    lat: float
    lng: float

class HeatmapBlob(BaseModel):
    lat: float
    lng: float
    radius: float
    r: int
    g: int
    b: int
    intensity: float

class Landmark(BaseModel):
    name: str
    type: str
    lat: float
    lng: float

class AIExplanation(BaseModel):
    title: str
    confidence: str
    summary: str
    evidence: str
    reasoning: str

class CognitiveMapResponse(BaseModel):
    search_radius_km: float
    predicted_path: List[PredictedPathPoint]
    heatmaps: List[HeatmapBlob]
    landmarks: List[Landmark]
    explanations: List[AIExplanation]
