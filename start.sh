#!/bin/bash

echo "Starting HealthBot Application..."
echo "================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js 16+ and try again"
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install Python dependencies"
    exit 1
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install Node.js dependencies"
    exit 1
fi
cd ..

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found"
    echo "Please copy env.example to .env and configure your settings"
    echo "You need to add your Gemini API key and other configuration"
    read -p "Press Enter to continue..."
fi

# Start the application
echo "Starting HealthBot..."
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo "================================================"

# Start backend in background
python3 run.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo "Application started successfully!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
