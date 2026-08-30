@echo off
title MamaRise - 1-Click Complete Launcher (Frontend + Backend)
echo ===================================================================
echo                     🌸 Launching MamaRise 🌸
echo        Perinatal Recovery, Load Rebalancing & Career Bridge
echo ===================================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found!
    echo Please install Node.js from https://nodejs.org/ (LTS recommended)
    echo.
    pause
    exit /b 1
)

:: 2. Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found!
    echo Please install Python 3.10+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

:: 3. Setup Python Backend Virtualenv & Dependencies
echo [1/4] Checking Backend Python Environment...
if not exist "backend\venv\" (
    echo Creating Python virtual environment...
    python -m venv backend\venv
)

echo Installing/Verifying Backend Dependencies...
call backend\venv\Scripts\pip install -r backend\requirements.txt --quiet

:: 4. Setup Frontend Node Dependencies
echo.
echo [2/4] Checking Frontend Dependencies...
if not exist "node_modules\" (
    echo Installing React dependencies (this takes ~1-2 mins on first run)...
    call npm install
)

:: 5. Start Backend in separate window
echo.
echo [3/4] Starting FastAPI Backend on http://localhost:8000...
start "MamaRise Backend API (Port 8000)" cmd /k "backend\venv\Scripts\python backend\run.py"

:: 6. Start Frontend React Dev Server
echo.
echo [4/4] Starting React Frontend on http://localhost:3000...
echo The app will open in your browser automatically!
echo (Keep this window open while testing. Close windows to stop).
echo.
call npm start
pause
