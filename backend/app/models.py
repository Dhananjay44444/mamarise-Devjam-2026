from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # "mom" or "partner"
    created_at = Column(DateTime, default=utc_now)

    checkins = relationship("RecoveryCheckin", back_populates="user", cascade="all, delete-orphan")
    voice_interactions = relationship("VoiceInteraction", back_populates="user", cascade="all, delete-orphan")


class RecoveryCheckin(Base):
    __tablename__ = "recovery_checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    sleep_hours = Column(Float, default=6.0)
    energy = Column(String(50), default="Okay")  # "Low", "Okay", "Good"
    pain = Column(String(50), default="None")    # "None", "Mild", "Moderate", "Severe"
    mood = Column(String(50), default="Okay")    # "Low", "Tired", "Okay", "Good"
    notes = Column(Text, nullable=True)
    
    # Deterministic Triage output fields
    triage_tier = Column(String(50), default="Standard Recovery") # "Urgent Rest", "Partner Alert", "Standard Recovery"
    capacity_score = Column(Integer, default=50) # 0 to 100
    alert_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="checkins")


class HouseholdTask(Base):
    __tablename__ = "household_tasks"

    id = Column(Integer, primary_key=True, index=True)
    task = Column(String(255), nullable=False)
    by = Column(String(50), default="Me")  # "Me", "Partner", "Unassigned"
    status = Column(String(50), default="pending")  # "pending", "confirmed", "completed"
    category = Column(String(100), default="Household") # "Baby Care", "Cleaning", "Cooking", "Errands"
    est_mins = Column(Integer, default=15)
    urgency = Column(String(50), default="Normal") # "Low", "Normal", "High"
    completed_at = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=utc_now)


class NutritionSuggestion(Base):
    __tablename__ = "nutrition_suggestions"

    id = Column(Integer, primary_key=True, index=True)
    pillar = Column(String(100), nullable=False) # "hydration", "iron_recovery", "nursing_snacks", "calming_tonics"
    title = Column(String(255), nullable=False)
    rationale = Column(Text, nullable=False)
    action_tip = Column(Text, nullable=False)
    source = Column(String(50), default="gemini-ai")
    created_at = Column(DateTime, default=utc_now)


class VoiceInteraction(Base):
    __tablename__ = "voice_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    transcript = Column(Text, nullable=False)
    detected_intent = Column(String(100), nullable=False)
    entities_json = Column(Text, nullable=True)
    empathetic_reply = Column(Text, nullable=False)
    status = Column(String(50), default="success")
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="voice_interactions")
