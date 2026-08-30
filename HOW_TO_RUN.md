# 🌸 MamaRise - Quick Start Guide

Welcome to **MamaRise**! Follow the simple steps below to run the complete website (Frontend + Backend) on your computer.

---

## ⚡ 1-Click Launch (Recommended)

### 🪟 If you are on Windows:
1. Extract the `.zip` folder.
2. Double-click **`start-all.bat`**.
3. It will automatically install any missing dependencies, start the backend on `http://localhost:8000`, and open the website in your browser at `http://localhost:3000`!

### 🍏 If you are on Mac or Linux:
1. Extract the `.zip` folder.
2. Open Terminal in the project folder and run:
   ```bash
   ./start-all.sh
   ```
3. It will install packages, launch both servers, and open `http://localhost:3000` automatically.

---

## 🛠️ Manual Launch (Alternative)

If you prefer to start the servers manually in two separate terminal windows:

### Terminal 1: Backend Server (FastAPI)
```bash
# Setup Python environment
python3 -m venv backend/venv
# On Mac/Linux:
source backend/venv/bin/activate
# On Windows:
# backend\venv\Scripts\activate

# Install requirements & start server
pip install -r backend/requirements.txt
python backend/run.py
```
*Backend runs at: `http://localhost:8000`*

### Terminal 2: Frontend Web App (React)
```bash
# Install dependencies & start
npm install
npm start
```
*Frontend opens automatically at: `http://localhost:3000`*

---

## 🔑 Pre-filled Demo Accounts
You can use the **1-Click Demo** buttons on the login screens, or use these credentials:
- **Mom Account:** `aisha@mamarise.app` / `recover123`
- **Partner Account:** `rohan@mamarise.app` / `support123`

---

## 🧪 Requirements
- **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
- **Python** (v3.10 or higher): [Download Python](https://www.python.org/)
