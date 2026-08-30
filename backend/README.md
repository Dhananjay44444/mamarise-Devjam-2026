# 🌸 MamaRise FastAPI Backend

Production-ready Python FastAPI backend for MamaRise with **Gemini AI Empathetic Voice & Nutrition Engine** and a **Deterministic Clinical Safety Rule Engine**.

---

## ⚡ Tech Stack & Architecture
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) with asynchronous ASGI endpoints
- **AI Engine:** Google Gemini 1.5 Flash / Pro (`gemini-1.5-flash`)
- **Database:** SQLite with [SQLAlchemy 2.0 ORM](https://www.sqlalchemy.org/)
- **Validation:** [Pydantic v2](https://docs.pydantic.dev/latest/)
- **Testing:** [Pytest](https://docs.pytest.org/)

---

## 🚀 How to Run the Backend

### Method 1: Using Virtual Environment (Recommended)
```bash
# 1. Activate venv or create one:
python3 -m venv backend/venv
source backend/venv/bin/activate    # On Windows: backend\venv\Scripts\activate

# 2. Install dependencies:
pip install -r backend/requirements.txt

# 3. Start the server:
python backend/run.py
```

Server runs on: **`http://localhost:8000`**  
Interactive OpenAPI Swagger Docs: **`http://localhost:8000/docs`**

---

## 🧩 Core Endpoints (`/api/v1`)

### 1. Gemini Empathetic Voice Assistant (`POST /api/v1/voice/process`)
- Takes spoken or typed transcripts.
- Calls Gemini AI to generate a serene, validating, postpartum-attuned response.
- Extracts structured actions (assigning tasks, completing chores, logging recovery metrics).

### 2. Gemini Nutrition Nudge Engine (`POST /api/v1/nutrition/suggestions`)
- Generates 4 restorative, evidence-based nutrition pillars:
  - **Hydration & Electrolytes**
  - **Iron & Tissue Recovery**
  - **1-Handed Nursing Fuel**
  - **Evening Calming Rest Tonics**

### 3. Deterministic Safety Rule Engine (`POST /api/v1/triage/evaluate`)
- Audited clinical recovery decision engine (never speculative AI hallucinations).
- Evaluates sleep hours, energy, pain, mood, and triggers partner alerts or doctor checkins.

### 4. Shared Household Tasks (`/api/v1/tasks/`)
- CRUD operations for shared domestic equity, partner takeover, and live mirror status.

---

## 🧪 Running Backend Unit Tests
```bash
backend/venv/bin/pytest backend/tests/
```
All tests verify SQLite ORM persistence, rule engine tiers, and Gemini fallback mechanisms.
