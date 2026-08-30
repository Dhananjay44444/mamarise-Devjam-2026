@echo off
title MamaRise Backend Launcher
echo ========================================================
echo        🌸 Launching MamaRise FastAPI Backend 🌸
echo ========================================================
echo.

:: Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://python.org/
    pause
    exit /b 1
)

cd backend
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing/verifying backend dependencies...
pip install -r requirements.txt
echo Starting backend server on http://localhost:8000 ...
python run.py
pause
