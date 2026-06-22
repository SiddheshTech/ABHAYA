from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from shared.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False) # e.g., police, ngo, judge
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FIR(Base):
    __tablename__ = "firs"
    
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    missing_person_name = Column(String(200))
    # PostGIS integration would involve GeoAlchemy2 for spatial types:
    # location = Column(Geometry('POINT'))
    latitude = Column(Float)
    longitude = Column(Float)
    reported_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="Registered")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
