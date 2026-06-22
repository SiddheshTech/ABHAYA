from pydantic import BaseModel
from typing import List, Optional

class GhostReconstructionInput(BaseModel):
    voice_recording_url: Optional[str] = None
    face_image_url: Optional[str] = None
    dental_scan_url: Optional[str] = None
    height_cm: Optional[float] = None
    arm_span_cm: Optional[float] = None
    observed_clothing_weave: Optional[str] = None

class OriginCluster(BaseModel):
    village: str
    district: str
    probability: float

class GhostProfileResponse(BaseModel):
    reconstruction_id: str
    confidence_score: float
    predicted_origin: List[OriginCluster]
    anthropometric_summary: str
    dialect_summary: str
