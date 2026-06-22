from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import sys
import os

# Add parent directory to path to import shared module
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from shared.database import get_pg_db
from shared.auth import get_current_user, require_role
from . import schemas

app = FastAPI(title="Rakshak Core API", version="1.0.0")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/v1/fir", response_model=schemas.FIRResponse)
async def create_fir(
    fir_in: schemas.FIRCreate, 
    db: AsyncSession = Depends(get_pg_db),
    user: dict = Depends(require_role("police"))
):
    """
    Create a new FIR. Only users with 'police' role can access this.
    (This is a placeholder for actual DB logic).
    """
    # Logic to save FIR to PostgreSQL using SQLAlchemy goes here.
    # We would also upload attachments to MinIO here.
    return {"id": 1, "case_number": fir_in.case_number, "status": "Registered"}

@app.get("/api/v1/fir/{fir_id}", response_model=schemas.FIRResponse)
async def get_fir(
    fir_id: int, 
    db: AsyncSession = Depends(get_pg_db),
    user: dict = Depends(get_current_user)
):
    """
    Retrieve an FIR. Any authenticated user can access this.
    """
    return {"id": fir_id, "case_number": "FIR-2026-001", "status": "Under Investigation"}
