from pydantic import BaseModel
from typing import List, Optional

class BiometricAnalysis(BaseModel):
    detectedAge: str
    ageConfidence: float
    estimatedHeight: str
    heightConfidence: float
    estimatedWeight: str
    weightConfidence: float
    gender: str
    genderConfidence: float
    facialFeatures: str
    facialConfidence: float
    bodyMarks: str
    marksConfidence: float
    scars: str
    birthmarks: str
    skinTone: str
    eyeColor: str
    hairColor: str
    hairTexture: str
    facialStructure: str
    bodyProportions: str
    medicalIndicators: List[str]
    biometricOverallConfidence: float

class VoiceAnalysis(BaseModel):
    noiseReductionPercent: float
    accentDetected: str
    dialectRecognized: str
    languageIdentified: str
    emotionDetected: str
    ageEstimatedByVoice: str
    genderEstimatedByVoice: str
    speechPatternMatched: str
    voiceprintSignature: str
    voiceConfidence: float

class PersonMatch(BaseModel):
    name: str
    relation: str
    confidence: float

class SchoolMatch(BaseModel):
    schoolName: str
    location: str
    grade: str
    matchScore: float

class MedicalMatch(BaseModel):
    condition: str
    hospitalName: str
    recordDate: str
    matchScore: float

class GovtMatch(BaseModel):
    databaseName: str
    recordId: str
    status: str
    matchScore: float

class Similarities(BaseModel):
    photo: float
    voice: float
    dna: float
    facial: float

class TimelineEvent(BaseModel):
    date: str
    event: str
    location: str

class ExplainableAI(BaseModel):
    acousticPhonemes: str
    facialStructure: str
    geographicSocioEconomic: str

class ReconstructedIdentity(BaseModel):
    possibleName: str
    overallConfidence: float
    region: str
    district: str
    village: str
    language: str
    likelyParents: List[PersonMatch]
    potentialRelatives: List[PersonMatch]
    schoolMatches: List[SchoolMatch]
    medicalMatches: List[MedicalMatch]
    governmentMatches: List[GovtMatch]
    similarities: Similarities
    timeline: List[TimelineEvent]
    explainableAI: ExplainableAI

class GhostProfileResponse(BaseModel):
    caseId: str
    biometricAnalysis: BiometricAnalysis
    voiceAnalysis: VoiceAnalysis
    reconstructedIdentity: ReconstructedIdentity

class GhostReconstructionInput(BaseModel):
    age: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    features: Optional[str] = None
    language: Optional[str] = None
    files: Optional[List[str]] = None
    userEmail: Optional[str] = None
