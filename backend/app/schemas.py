from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User ---
class UserBase(BaseModel):
    email: str
    name: str
    role: str

class UserCreate(UserBase):
    password: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Recovery & Checkin ---
class RecoveryInput(BaseModel):
    sleep_hours: float = Field(default=6.0, ge=0, le=24)
    energy: str = Field(default="Okay", pattern="^(Low|Okay|Good)$")
    pain: str = Field(default="None", pattern="^(None|Mild|Moderate|Severe)$")
    mood: str = Field(default="Okay", pattern="^(Low|Tired|Okay|Good)$")
    notes: Optional[str] = None

class TriageEvaluationOut(BaseModel):
    triage_tier: str
    capacity_score: int
    capacity_level: str
    partner_alert_needed: bool
    clinical_recommendation: str
    suggested_actions: List[str]


# --- Household Task ---
class HouseholdTaskBase(BaseModel):
    task: str
    by: Optional[str] = "Me"
    status: Optional[str] = "pending"
    category: Optional[str] = "Household"
    est_mins: Optional[int] = 15
    urgency: Optional[str] = "Normal"

class HouseholdTaskCreate(HouseholdTaskBase):
    pass

class HouseholdTaskUpdate(BaseModel):
    task: Optional[str] = None
    by: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    est_mins: Optional[int] = None
    urgency: Optional[str] = None
    completed_at: Optional[str] = None

class HouseholdTaskOut(HouseholdTaskBase):
    id: int
    completed_at: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Voice Processing ---
class VoiceCommandRequest(BaseModel):
    transcript: str
    current_role: Optional[str] = "mom"
    user_context: Optional[Dict[str, Any]] = None

class VoiceCommandResponse(BaseModel):
    status: str
    raw_transcript: str
    intent: str
    entities: Dict[str, Any]
    empathetic_reply: str
    action_type: str
    action_payload: Dict[str, Any]
    summary_message: str


# --- Nutrition Nudge ---
class NutritionPromptRequest(BaseModel):
    phase: Optional[str] = "Week 8 Postpartum"
    current_energy: Optional[str] = "Low"
    sleep_hours: Optional[float] = 5.0
    dietary_preference: Optional[str] = "Vegetarian/General"

class NutritionPillarSuggestion(BaseModel):
    pillar: str
    pillar_title: str
    title: str
    rationale: str
    action_tip: str
    timing: str
    quick_prep_mins: int

class NutritionNudgeResponse(BaseModel):
    status: str
    suggestions: List[NutritionPillarSuggestion]
    generated_at: str
