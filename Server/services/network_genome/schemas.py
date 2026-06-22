from pydantic import BaseModel
from typing import List

class NetworkAnalysisInput(BaseModel):
    seed_node_ids: List[str]
    timeframe_days: int = 30

class TopologyMapResponse(BaseModel):
    network_id: str
    command_nodes: List[str]
    vulnerability_sequence: List[str]
    nodes_analyzed: int
    edges_analyzed: int

class MutationPredictionInput(BaseModel):
    network_id: str
    collapsed_node_id: str
    event_type: str # e.g. "Raid", "Arrest", "Route_Closure"

class MutationPredictionResponse(BaseModel):
    collapsed_node: str
    predicted_reroute_locations: List[str]
    timeframe_hours: int
    new_financial_flow: str
    confidence: float
