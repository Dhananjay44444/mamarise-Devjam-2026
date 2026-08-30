import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import VoiceCommandRequest, VoiceCommandResponse
from ..models import VoiceInteraction
from ..services.gemini_service import GeminiService

router = APIRouter(prefix="/voice", tags=["Voice Assistant"])

@router.post("/process", response_model=VoiceCommandResponse)
async def process_voice_command(
    request: VoiceCommandRequest,
    db: Session = Depends(get_db)
):
    """
    Processes voice transcript using Gemini AI to return a calm, empathetic, validating
    postpartum response alongside structured intent and actionable state mutation payload.
    """
    transcript = request.transcript.strip()
    if not transcript:
        raise HTTPException(status_code=400, detail="Voice transcript cannot be empty.")

    # Generate empathetic response & extract intent via Gemini
    gemini_data = await GeminiService.generate_empathetic_voice_reply(
        transcript=transcript,
        role=request.current_role or "mom",
        user_context=request.user_context
    )

    intent = gemini_data.get("intent", "GENERAL_SUPPORT")
    task_name = gemini_data.get("task_name", "Household Task")
    assign_to = gemini_data.get("assign_to", "Partner")
    empathetic_reply = gemini_data.get(
        "empathetic_reply",
        "I'm listening and right here with you. Take a gentle breath—you are doing enough."
    )

    # Prepare structured state actions
    action_type = "VOICE_GENERAL"
    action_payload = {"rawTranscript": transcript}
    summary_message = f'Heard: "{transcript}"'

    if intent == "ASSIGN_TASK":
        action_type = "VOICE_ASSIGN_TASK"
        action_payload = {
            "task": task_name,
            "by": assign_to,
            "rawTranscript": transcript,
        }
        summary_message = f'Assigned "{task_name}" to {assign_to}.'
    elif intent == "COMPLETE_TASK":
        action_type = "VOICE_COMPLETE_TASK"
        action_payload = {
            "taskName": task_name,
            "rawTranscript": transcript,
        }
        summary_message = f'Marked "{task_name}" as complete.'
    elif intent == "LOG_RECOVERY":
        action_type = "VOICE_UPDATE_RECOVERY"
        action_payload = {
            "energy": gemini_data.get("energy", "Low"),
            "sleepHours": gemini_data.get("sleep_hours", 5),
            "pain": gemini_data.get("pain", "None"),
            "mood": gemini_data.get("mood", "Tired"),
            "rawTranscript": transcript,
        }
        summary_message = f'Logged recovery update via voice.'

    # Persist interaction into database
    try:
        record = VoiceInteraction(
            transcript=transcript,
            detected_intent=intent,
            entities_json=json.dumps(gemini_data),
            empathetic_reply=empathetic_reply,
            status="success"
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    except Exception as e:
        db.rollback()

    return VoiceCommandResponse(
        status="success",
        raw_transcript=transcript,
        intent=intent,
        entities=gemini_data,
        empathetic_reply=empathetic_reply,
        action_type=action_type,
        action_payload=action_payload,
        summary_message=summary_message
    )
