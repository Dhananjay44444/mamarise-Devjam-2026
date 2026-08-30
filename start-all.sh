#!/usr/bin/env bash

echo "==================================================================="
echo "                    🌸 Launching MamaRise 🌸"
echo "       Perinatal Recovery, Load Rebalancing & Career Bridge"
echo "==================================================================="
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ [ERROR] Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    exit 1
fi

# 2. Check Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ [ERROR] Python 3 is not installed!"
    echo "Please install Python 3.10+ from: https://www.python.org/"
    exit 1
fi

# 3. Setup Backend Virtual Environment
echo "📦 [1/4] Setting up Backend Python environment..."
if [ ! -d "backend/venv" ]; then
    python3 -m venv backend/venv
fi

echo "Installing/verifying backend requirements..."
./backend/venv/bin/pip install -r backend/requirements.txt --quiet

# 4. Setup Frontend Node modules
echo ""
echo "📦 [2/4] Checking Frontend dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing React dependencies (first run only)..."
    npm install
fi

# 5. Start Backend in background
echo ""
echo "🚀 [3/4] Starting FastAPI backend server on http://localhost:8000..."
./backend/venv/bin/python backend/run.py &
BACKEND_PID=$!

# Trap cleanup to kill backend when script terminates
cleanup() {
    echo ""
    echo "Shutting down MamaRise services..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 6. Start React Frontend
echo ""
echo "🚀 [4/4] Starting React frontend dev server on http://localhost:3000..."
echo "Your browser will open automatically at http://localhost:3000"
echo "Press Ctrl+C anytime to stop all servers."
echo ""

npm start
