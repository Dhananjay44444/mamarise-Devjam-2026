from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import RecoveryInput, TriageEvaluationOut
from ..models import RecoveryCheckin
from ..services.rule_engine import SafetyRuleEngine

router = APIRouter(prefix="/triage", tags=["Safety Rule Engine"])

@router.post("/evaluate", response_model=TriageEvaluationOut)
async def evaluate_recovery_triage(
    input_data: RecoveryInput,
    db: Session = Depends(get_db)
):
    """
    Evaluates physical and emotional postpartum recovery using MamaRise's strict
    deterministic clinical safety rule engine (never speculative AI generation).
    """
    evaluation = SafetyRuleEngine.evaluate_triage(
        sleep_hours=input_data.sleep_hours,
        energy=input_data.energy,
        pain=input_data.pain,
        mood=input_data.mood,
    )

    # Persist checkin into SQLite database
    try:
        checkin = RecoveryCheckin(
            sleep_hours=input_data.sleep_hours,
            energy=input_data.energy,
            pain=input_data.pain,
            mood=input_data.mood,
            notes=input_data.notes,
            triage_tier=evaluation["triage_tier"],
            capacity_score=evaluation["capacity_score"],
            alert_generated=evaluation["partner_alert_needed"]
        )
        db.add(checkin)
        db.commit()
        db.refresh(checkin)
    except Exception:
        db.rollback()

    return TriageEvaluationOut(
        triage_tier=evaluation["triage_tier"],
        capacity_score=evaluation["capacity_score"],
        capacity_level=evaluation["capacity_level"],
        partner_alert_needed=evaluation["partner_alert_needed"],
        clinical_recommendation=evaluation["clinical_recommendation"],
        suggested_actions=evaluation["suggested_actions"]
    )
