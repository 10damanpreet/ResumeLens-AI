@echo off
cd /d "%~dp0"
title ResumeLens AI - Launcher
color 0A
echo.
echo  ============================================================
echo               RESUMELENS AI - LAUNCHER
echo  ============================================================
echo  No Docker needed! Running directly with SQLite and FastAPI.
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python is not installed or not in PATH.
    echo  Please install Python from python.org and check "Add Python to PATH".
    pause
    exit /b 1
)

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Please install Node.js from nodejs.org.
    pause
    exit /b 1
)

:: Check Python dependencies
echo  [1/3] Verifying Python packages...
python -c "import fastapi, uvicorn, aiosqlite, aiofiles" >nul 2>&1
if errorlevel 1 (
    echo  Installing missing Python dependencies...
    python -m pip install fastapi uvicorn[standard] aiosqlite aiofiles sqlalchemy pydantic-settings python-jose[cryptography] bcrypt python-multipart sentence-transformers rapidfuzz google-generativeai pdfplumber python-docx
)

:: Check Frontend dependencies
echo  [2/3] Verifying Frontend packages...
if not exist "frontend\node_modules" (
    echo  Installing frontend dependencies...
    cd /d "%~dp0frontend"
    npm install
    cd /d "%~dp0"
)

echo  [3/3] Starting servers...
echo.
echo  ============================================================
echo   * Backend API : http://localhost:8000
echo   * Swagger Docs: http://localhost:8000/docs
echo   * Web App (UI): http://localhost:5173
echo  ============================================================
echo.

:: Start backend in a dedicated window
start "ResumeMatcher - Backend" cmd /k "cd /d ""%~dp0"" && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: Wait for backend to spin up
timeout /t 3 /nobreak >nul

:: Start frontend in a dedicated window
start "ResumeMatcher - Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

:: Open the web app in browser
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo  Servers are running in their respective background windows.
echo  You can close this launcher window now, or press any key to exit.
pause >nul
