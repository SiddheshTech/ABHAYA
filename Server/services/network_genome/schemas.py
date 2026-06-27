from pydantic import BaseModel
from typing import List

from pydantic import BaseModel
from typing import List, Optional

class ShiftDetail(BaseModel):
    from_location: str
    to_location: str

class GenomeSequenceResponse(BaseModel):
    target_network: str
    mutation_probability: int
    expected_shift: ShiftDetail
    predicted_expansion: str
    expansion_confidence: int
    network_strength_percent: int
    mutation_risk_level: str
    collapse_point_nodes: int
    collapse_probability: int
    logistics_shift: str
    recruitment_shift: str

