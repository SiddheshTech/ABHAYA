from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from shared.auth import require_role
from shared.database import get_pg_db
from . import schemas

app = FastAPI(title="Rakshak Psychology & Search API", version="1.0.0")

@app.post("/api/v1/search/profile", response_model=schemas.PerpetratorProfileResponse)
async def get_perpetrator_insights(
    data: schemas.PerpetratorProfileInput,
    user: dict = Depends(require_role("police"))
):
    """
    USP 4: Perpetrator Psychology Insights.
    Matches current profile with historical serial abductor patterns.
    """
    # Vector search against Qdrant/Elasticsearch based on case details
    
    return schemas.PerpetratorProfileResponse(
        insight="This profile matches serial abductor pattern from 2019.",
        suggested_previous_cases=["FIR-2019-102", "FIR-2019-250"],
        confidence=0.89
    )

@app.post("/api/v1/search/cognitive-map", response_model=schemas.CognitiveMapResponse)
async def generate_cognitive_map(
    data: schemas.CognitiveMapInput,
    db: AsyncSession = Depends(get_pg_db),
    user: dict = Depends(require_role("police"))
):
    """
    USP 5: Cognitive Topography Mapping.
    Runs a custom pathfinding algorithm weighted by psychological attractors/detractors.
    """
    # 1. Fetch OpenStreetMap (OSM) data around the center_lat/lng from PostGIS.
    # 2. Apply A* weighting:
    #    If profile == "Autistic", weight bodies of water heavily (attractor).
    #    If profile == "ADHD", weight loud industrial zones negatively (detractor).
    # 3. Generate GeoJSON heatmap.
    
    # Placeholder Response
    return schemas.CognitiveMapResponse(
        search_radius_km=data.radius_km,
        heatmap_geojson={
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [data.center_lng + 0.01, data.center_lat + 0.01]
                    },
                    "properties": {
                        "weight": 0.95,
                        "reason": "Active train track proximity - High Risk for Autistic profile."
                    }
                }
            ]
        }
    )
