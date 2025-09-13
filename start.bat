@echo off
echo Starting HealthBot Application...
echo ================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ and try again
    pause
    exit /b 1
)

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)

REM Install Node.js dependencies
echo Installing Node.js dependencies...
cd client
npm install
if errorlevel 1 (
    echo Error: Failed to install Node.js dependencies
    pause
    exit /b 1
)
cd ..

REM Check if .env file exists
if not exist .env (
    echo Warning: .env file not found
    echo Please copy env.example to .env and configure your settings
    echo You need to add your Gemini API key and other configuration
    pause
)

REM Start the application
echo Starting HealthBot...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo ================================================

REM Start backend in a new window
start "HealthBot Backend" cmd /k "python run.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "HealthBot Frontend" cmd /k "cd client && npm start"

echo Application started successfully!
echo Check the opened windows for the backend and frontend servers
pause
