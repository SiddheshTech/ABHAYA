from pydantic import BaseModel
from typing import List

class DisplacementAlert(BaseModel):
    district: str
    state: str
    factors: List[str]
    predicted_risk_window_weeks: str
    recommendation: str
    vulnerability_score: float

class DisplacementAlertResponse(BaseModel):
    alerts: List[DisplacementAlert]
