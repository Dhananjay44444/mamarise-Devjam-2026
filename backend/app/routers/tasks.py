from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import HouseholdTaskCreate, HouseholdTaskUpdate, HouseholdTaskOut
from ..models import HouseholdTask

router = APIRouter(prefix="/tasks", tags=["Household Tasks"])

@router.get("/", response_model=List[HouseholdTaskOut])
def get_household_tasks(db: Session = Depends(get_db)):
    """Fetches all shared household chores and workload tasks."""
    return db.query(HouseholdTask).order_by(HouseholdTask.id.desc()).all()

@router.post("/", response_model=HouseholdTaskOut)
def create_household_task(task_in: HouseholdTaskCreate, db: Session = Depends(get_db)):
    """Creates a new household task."""
    task = HouseholdTask(
        task=task_in.task,
        by=task_in.by or "Me",
        status=task_in.status or "pending",
        category=task_in.category or "Household",
        est_mins=task_in.est_mins or 15,
        urgency=task_in.urgency or "Normal"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{task_id}", response_model=HouseholdTaskOut)
def update_household_task(task_id: int, task_in: HouseholdTaskUpdate, db: Session = Depends(get_db)):
    """Updates task status, assignee, or completion details."""
    task = db.query(HouseholdTask).filter(HouseholdTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(task, field, val)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_household_task(task_id: int, db: Session = Depends(get_db)):
    """Deletes a household task."""
    task = db.query(HouseholdTask).filter(HouseholdTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"status": "deleted", "id": task_id}

@router.post("/rebalance-suggestions")
async def get_ai_rebalance_suggestions(payload: dict):
    """
    Generates intelligent household rebalancing suggestions powered by Gemini AI.
    Analyzes Mom's recovery metrics, pain points, active chores, and domestic load split.
    """
    from ..services.gemini_service import GeminiService
    
    recovery = payload.get("recovery", {})
    chores = payload.get("chores", [])
    chore_split = payload.get("choreSplit", {"me": 75, "partner": 25})
    partner_name = payload.get("partnerName", "Partner")

    suggestions = await GeminiService.generate_rebalance_recommendations(
        recovery=recovery,
        chores=chores,
        chore_split=chore_split,
        partner_name=partner_name
    )
    return {"suggestions": suggestions}
