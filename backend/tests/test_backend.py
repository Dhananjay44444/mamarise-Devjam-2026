import sys
import os
import pytest

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.services.rule_engine import SafetyRuleEngine

client = TestClient(app)

def test_root_and_health():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "MamaRise Backend API"
    assert data["status"] == "healthy"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ok"


def test_deterministic_safety_rule_engine():
    # Tier 1: Severe pain / red flag
    tier1 = SafetyRuleEngine.evaluate_triage(sleep_hours=6, energy="Good", pain="Severe", mood="Good")
    assert tier1["triage_tier"] == "Clinical Consultation Required"
    assert tier1["partner_alert_needed"] is True
    assert tier1["capacity_score"] <= 20

    # Tier 2: Low sleep / exhaustion
    tier2 = SafetyRuleEngine.evaluate_triage(sleep_hours=4, energy="Low", pain="None", mood="Tired")
    assert tier2["triage_tier"] == "Low Capacity / Urgent Rest"
    assert tier2["partner_alert_needed"] is True
    assert tier2["capacity_score"] == 35

    # Tier 3: Steady Recovery
    tier3 = SafetyRuleEngine.evaluate_triage(sleep_hours=6, energy="Okay", pain="Mild", mood="Okay")
    assert tier3["triage_tier"] == "Steady Recovery"
    assert tier3["partner_alert_needed"] is False
    assert tier3["capacity_score"] == 65


def test_triage_api_endpoint():
    payload = {
        "sleep_hours": 4.5,
        "energy": "Low",
        "pain": "Moderate",
        "mood": "Tired",
        "notes": "Nursing strain"
    }
    response = client.post("/api/v1/triage/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["partner_alert_needed"] is True
    assert "Low Capacity" in data["triage_tier"]


def test_nutrition_nudge_api():
    payload = {
        "phase": "Week 8 Postpartum",
        "current_energy": "Low",
        "sleep_hours": 5.0,
        "dietary_preference": "Vegetarian"
    }
    response = client.post("/api/v1/nutrition/suggestions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["suggestions"]) == 4
    
    pillars = [s["pillar"] for s in data["suggestions"]]
    assert "hydration" in pillars
    assert "iron_recovery" in pillars
    assert "nursing_snacks" in pillars
    assert "calming_tonics" in pillars


def test_voice_command_processing():
    payload = {
        "transcript": "Rohan please take over folding the laundry and washing baby bottles",
        "current_role": "mom"
    }
    response = client.post("/api/v1/voice/process", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["empathetic_reply"]) > 5
    assert data["intent"] in ["ASSIGN_TASK", "GENERAL_SUPPORT", "COMPLETE_TASK"]


def test_household_tasks_crud():
    # Create task
    create_payload = {
        "task": "Sanitize infant feeding pumps",
        "by": "Partner",
        "category": "Baby Care",
        "est_mins": 20
    }
    create_res = client.post("/api/v1/tasks/", json=create_payload)
    assert create_res.status_code == 200
    task_data = create_res.json()
    task_id = task_data["id"]
    assert task_data["task"] == "Sanitize infant feeding pumps"

    # Fetch tasks
    get_res = client.get("/api/v1/tasks/")
    assert get_res.status_code == 200
    tasks = get_res.json()
    assert any(t["id"] == task_id for t in tasks)

    # Update task
    update_res = client.patch(f"/api/v1/tasks/{task_id}", json={"status": "completed"})
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "completed"

    # Delete task
    del_res = client.delete(f"/api/v1/tasks/{task_id}")
    assert del_res.status_code == 200
