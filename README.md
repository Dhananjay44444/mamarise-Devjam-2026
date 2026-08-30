# 🌸 MamaRise — Empowering Postpartum Recovery, Partner Equity & Career Transition

MamaRise is an intelligent, compassionate perinatal care and domestic load equity platform built for new mothers and their partners. It combines **Google Gemini 1.5 Flash** for empathetic voice guidance and restorative 4th-trimester nutrition suggestions, a **deterministic clinical safety rule engine** for postpartum triage, and a **micro-learning career restart hub** with active watch-time tracking.

---

## 🏗️ System Architecture

- **Frontend (React 18 + TailwindCSS + Lucide Icons + Framer Motion):**
  - **Mom Portal:** Daily recovery check-in, load balance mirror, Nourish Nudge, Care Circle, video learning tracks.
  - **Partner Portal:** Domestic load visibility, "I'll handle this" task takeover, real-time sync, recovery notifications.
  - **Gemini Empathetic Voice Companion:** Hands-free voice commands with serene, validating postpartum responses.
  - **Career Restart Hub:** 5 comprehensive tracks (UI/UX, Python, Java, Freelancing, Data Analytics) with Page Visibility & real-time study tracking.
  - **Readiness Portfolio:** Exportable & printable verified career credential.

- **Backend (Python FastAPI + SQLAlchemy + SQLite + Google Gemini 1.5):**
  - **Gemini Voice Assistant (`POST /api/v1/voice/process`):** Analyzes speech transcript, extracts intent, and responds with empathetic companion replies.
  - **Gemini Nutrition Nudge (`POST /api/v1/nutrition/suggestions`):** Delivers zero-guilt, restorative postpartum nutrition across 4 core pillars.
  - **Safety Triage Engine (`POST /api/v1/triage/evaluate`):** Multi-tier clinical rule engine (Green / Amber / Red) with automatic partner alerts.
  - **Shared Household Tasks (`/api/v1/tasks/`):** Domestic chore equity and live mirror status.

---

## 🚀 Quick Start Guide (Running on VS Code / Windows / Mac / Linux)

### 📋 Prerequisites
1. **Node.js** (v18 or v20 LTS): [Download from nodejs.org](https://nodejs.org/)
2. **Python** (v3.10+): [Download from python.org](https://python.org/) *(Optional for full AI backend; frontend includes graceful offline fallbacks)*

---

### Method 1: VS Code (Universal)

#### Step 1: Open Project in VS Code
1. Open **VS Code**.
2. Go to **File -> Open Folder...** and select this project folder (`mamarise-project`).

#### Step 2: Start Frontend (React App)
1. Open a terminal in VS Code (**Terminal -> New Terminal** or `` Ctrl + ` `` / `` Cmd + ` ``).
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```
4. The app will launch in your browser at **`http://localhost:3000`**!

#### Step 3: Start Backend (FastAPI + Gemini AI) — *In a 2nd Terminal Tab*
1. Click the **`+`** icon in the VS Code terminal to open a second terminal tab.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Create and activate a virtual environment:
   - **On Mac / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - **On Windows (PowerShell / Command Prompt):**
     ```powershell
     python -m venv venv
     venv\Scripts\activate
     ```
4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Launch the backend server:
   ```bash
   python run.py
   ```
6. Backend runs at **`http://localhost:8000`** (Swagger API Docs at **`http://localhost:8000/docs`**).

---

### Method 2: Double-Click Helper (Windows Only)
1. **Frontend:** Double-click **`start-windows.bat`** (installs dependencies and opens browser automatically).
2. **Backend:** Double-click **`start-backend.bat`** (activates venv and starts FastAPI server).

---

## 🔑 Demo Logins & Role Switching

You can switch between roles instantly using the demo buttons on the login page or log in manually:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Mom Portal** | `aisha@mamarise.app` | `recover123` | Daily Triage, Recovery Pulse, Load Mirror, Nourish Nudge, Care Circle, Career Hub |
| **Partner Portal** | `rohan@mamarise.app` | `support123` | Partner Sync, "I'll handle this" chore takeover, Recovery alerts, Shared equity |

---

## 🧪 Running Automated Tests

### Frontend Tests (Jest / React Testing Library)
```bash
npm test -- --watchAll=false
```
*Tests state management, auth service, voice intent parsing, and video tracking.*

### Backend Tests (Pytest)
```bash
# With backend venv activated:
pytest backend/tests/
```
*Tests FastAPI endpoints, SQLite persistence, rule triage tiers, and Gemini fallback handlers.*

---

## 🌟 Key Innovations for DevJam 2026
1. **Deterministic Clinical Safety First:** Triage rules are strictly clinical (never hallucinatory LLM advice for medical danger signs).
2. **Gemini 1.5 Flash Companion:** Empathetic voice validation and fourth-trimester restorative nutrition suggestions.
3. **True Domestic Equity:** Bridges invisible maternal cognitive load with one-tap partner task delegation.
4. **Adaptive Career Readiness:** Byte-sized video learning designed for postpartum energy levels with verified credential generation.
