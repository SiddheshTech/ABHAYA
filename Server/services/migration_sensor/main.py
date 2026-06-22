from fastapi import FastAPI, Depends
from elasticsearch import Elasticsearch
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from shared.auth import require_role
from shared.database import get_es_client
from . import schemas

app = FastAPI(title="Rakshak Migration Sensor API", version="1.0.0")

@app.get("/api/v1/migration/alerts", response_model=schemas.DisplacementAlertResponse)
async def get_displacement_alerts(
    district_code: str = None,
    es: Elasticsearch = Depends(get_es_client),
    user: dict = Depends(require_role("ngo"))
):
    """
    USP 3: The Invisible Migration Sensor.
    Fetches early warning alerts for population-level child displacement.
    """
    # 1. Query Elasticsearch index where Vulnerability Index data is stored.
    # The Vulnerability Index is updated via background Celery tasks polling IMD/NDMA.
    # 2. Return districts that cross the threshold.
    
    # Placeholder Response
    return schemas.DisplacementAlertResponse(
        alerts=[
            schemas.DisplacementAlert(
                district="District X",
                state="Assam",
                factors=["flood", "economic distress pattern matches historical pre-trafficking"],
                predicted_risk_window_weeks="4-8 weeks",
                recommendation="NGO pre-positioning, heightened school monitoring, Ghost Child Registration drive.",
                vulnerability_score=0.94
            )
        ]
    )

@app.post("/api/v1/migration/trigger-poll")
async def manual_trigger_data_poll(user: dict = Depends(require_role("national_admin"))):
    """
    Manually triggers the background worker to fetch data from IMD/NDMA/MGNREGA.
    """
    # Celery task trigger would go here:
    # `poll_government_apis.delay()`
    return {"status": "Background polling job triggered."}
