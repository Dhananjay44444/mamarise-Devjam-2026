MamaRise Project Overview and Architecture

Project Idea

MamaRise is a digital platform designed to address the physical exhaustion, mental overload, and invisible household burden experienced by mothers during the fourth trimester postpartum period. It bridges the gap between maternal recovery, equal domestic chore sharing with partners, and gradual career upskilling. Instead of pushing hustle culture or rigid routines, MamaRise helps mothers monitor their daily recovery, easily delegate chores to their partners, get restorative nutrition advice, and rebuild career confidence through byte-sized video learning tracks.


Frontend Tools and Technologies

The frontend is built using React 18 for component architecture and state management. Tailwind CSS provides styling and layout responsiveness. Framer Motion handles screen transitions and micro-interactions. Lucide React supplies icons across all dashboards. Recharts is used to visualize recovery capacity trends and task distributions between partners. The Web Speech API powers voice recognition directly inside the browser, allowing hands-free voice logging for busy mothers.


Backend Tools and Technologies

The backend is built with Python using the FastAPI framework for asynchronous high-performance REST APIs. SQLAlchemy 2.0 ORM manages data persistence on an SQLite database. Pydantic v2 handles request validation and response schemas. Uvicorn acts as the ASGI web server. Pytest is used for backend automated testing.


How Gemini 1.5 Flash is Used

Google Gemini 1.5 Flash is integrated as a supportive, empathetic companion and nutrition engine. It is used in two key places:

1. Empathetic Voice Assistant: When a user speaks a command (such as assigning a task to a partner, marking something done, or saying they feel exhausted), Gemini Flash analyzes the transcript. It extracts the structured action and returns a warm, reassuring, guilt-free message that validates the mother's feelings and reminds her to rest.

2. Nutrition Nudge Engine: Gemini Flash acts as a perinatal nutritionist. Based on the mother's current energy level, hours of sleep, and postpartum recovery phase, it generates practical, restorative suggestions across four pillars: hydration and electrolytes, iron and tissue recovery, one-handed nursing snacks, and evening calming tonics. It completely avoids calorie counting and focuses purely on healing.


Python Clinical Safety Rule Engine

While Gemini handles empathetic conversational responses, all health triage decisions are governed by a strict, deterministic Python rule engine (SafetyRuleEngine) to prevent artificial intelligence hallucinations in medical contexts.

The rule engine evaluates sleep duration, energy level, pain severity, mood, and red-flag symptoms (like high fever or heavy bleeding) into four distinct tiers:

Tier 1 - Red Flag Clinical Consultation: Triggered if there is severe pain, fever, or heavy bleeding. The system sets capacity to 15 percent, sends an urgent alert to the partner to take over all chores, and advises contacting an obstetrician or midwife immediately.

Tier 2 - Low Capacity and Urgent Rest: Triggered when sleep is under 5 hours, pain is moderate, or exhaustion is severe. Capacity is scored at 35 percent, chores are flagged for partner takeover, and non-essential tasks are paused.

Tier 3 - Steady Recovery: Triggered when sleep is between 5 and 7 hours with moderate energy. Capacity is set to 65 percent, and gentle 15-minute micro-learning sessions are suggested.

Tier 4 - High Capacity and Return Ready: Triggered when restorative sleep and comfort are high. Capacity reaches 90 percent, and full career restart tracks (UI/UX, Python, Java, Data Analytics, Freelancing) are unlocked.


End-to-End Code Flow

1. User Action: The user performs an action in the React app, such as completing a daily recovery check-in, speaking a voice command, or opening the nutrition section.

2. Frontend Dispatch: React calls the API client in dataService.js or parses initial intents locally for immediate UI responsiveness.

3. Backend API Route: FastAPI receives the request at the corresponding endpoint (/api/v1/voice/process, /api/v1/triage/evaluate, or /api/v1/nutrition/suggestions).

4. Processing and AI Integration:
For voice and nutrition requests, the backend calls GeminiService to invoke Google Gemini 1.5 Flash with custom clinical system prompts.
For recovery check-ins, the backend runs SafetyRuleEngine to calculate the deterministic capacity score and determine if partner intervention is needed.

5. Database Persistence: Voice interactions, recovery records, nutrition recommendations, and shared tasks are stored in the SQLite database via SQLAlchemy models.

6. Response and Live UI Update: The backend returns structured JSON to the frontend. React updates the central store, updates the recovery score, displays Gemini's empathetic message, and syncs shared domestic tasks to the Partner Dashboard.


How to Run the Project

1. Frontend:
Open a terminal in the root directory and run:
npm install
npm start
The application will open at http://localhost:3000

2. Backend:
Open a second terminal, navigate into the backend directory, and run:
python -m venv venv
On Mac or Linux run: source venv/bin/activate
On Windows run: venv\Scripts\activate
pip install -r requirements.txt
python run.py
The backend server will run at http://localhost:8000 (API documentation at http://localhost:8000/docs)

3. Demo Accounts:
Mom Portal: aisha@mamarise.app (Password: recover123)
Partner Portal: rohan@mamarise.app (Password: support123)
Quick role switch buttons are also available directly on the login page.
