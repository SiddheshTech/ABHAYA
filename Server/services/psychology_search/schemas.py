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

class CognitiveMapResponse(BaseModel):
    search_radius_km: float
    heatmap_geojson: Dict[str, Any]
