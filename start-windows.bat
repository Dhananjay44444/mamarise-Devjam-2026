@echo off
title MamaRise Application Launcher
echo ========================================================
echo               🌸 Launching MamaRise 🌸
echo ========================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system!
    echo Please download and install Node.js LTS from: https://nodejs.org/
    echo After installing, run this file again.
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Node.js and NPM versions...
node -v
npm -v
echo.

:: Check if node_modules exists, if not install
if not exist "node_modules\" (
    echo [2/3] First time setup: Installing project dependencies...
    echo (This may take 1-2 minutes depending on your internet connection)
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies. Please check your internet connection.
        pause
        exit /b 1
    )
) else (
    echo [2/3] Dependencies already installed.
)

echo.
echo [3/3] Starting MamaRise Local Dev Server...
echo The application will open automatically at http://localhost:3000
echo (Keep this window open while using the app. Press Ctrl+C to stop).
echo.

npm start
pause
