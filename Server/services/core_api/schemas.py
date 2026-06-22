from pydantic import BaseModel
from typing import Optional

class FIRCreate(BaseModel):
    case_number: str
    description: str
    missing_person_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FIRResponse(BaseModel):
    id: int
    case_number: str
    status: str

    class Config:
        from_attributes = True
