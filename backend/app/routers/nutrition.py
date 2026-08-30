from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import NutritionPromptRequest, NutritionNudgeResponse, NutritionPillarSuggestion
from ..models import NutritionSuggestion
from ..services.gemini_service import GeminiService

router = APIRouter(prefix="/nutrition", tags=["Nutrition Nudge"])

@router.post("/suggestions", response_model=NutritionNudgeResponse)
async def get_nutrition_suggestions(
    request: NutritionPromptRequest,
    db: Session = Depends(get_db)
):
    """
    Generates intelligent postpartum nutrition suggestions across the 4 core pillars:
    1. Hydration & Electrolytes
    2. Iron & Tissue Recovery
    3. 1-Handed Nursing Fuel
    4. Evening Calming Rest Tonics
    Powered by Gemini AI with zero diet culture or calorie tracking.
    """
    gemini_items = await GeminiService.generate_nutrition_suggestions(
        phase=request.phase or "Week 8 Postpartum",
        current_energy=request.current_energy or "Low",
        sleep_hours=request.sleep_hours or 5.0,
        dietary_preference=request.dietary_preference or "General"
    )

    pillar_suggestions = []
    for item in gemini_items:
        suggestion = NutritionPillarSuggestion(
            pillar=item.get("pillar", "hydration"),
            pillar_title=item.get("pillar_title", "Recovery Nutrition"),
            title=item.get("title", "Restorative Nutrients"),
            rationale=item.get("rationale", "Promotes postpartum tissue repair."),
            action_tip=item.get("action_tip", "Drink 1 glass of warm water."),
            timing=item.get("timing", "Morning"),
            quick_prep_mins=item.get("quick_prep_mins", 3)
        )
        pillar_suggestions.append(suggestion)

        # Store suggestion in SQLite database
        try:
            record = NutritionSuggestion(
                pillar=suggestion.pillar,
                title=suggestion.title,
                rationale=suggestion.rationale,
                action_tip=suggestion.action_tip,
                source="gemini-ai"
            )
            db.add(record)
        except Exception:
            pass

    try:
        db.commit()
    except Exception:
        db.rollback()

    return NutritionNudgeResponse(
        status="success",
        suggestions=pillar_suggestions,
        generated_at=datetime.now(timezone.utc).isoformat()
    )
