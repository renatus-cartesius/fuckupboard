#!/bin/bash

# Start the Golang backend
echo "Starting Golang backend..."
go run main.go &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start the React frontend
echo "Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

echo "Backend running on http://localhost:8080"
echo "Frontend running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID
kill $FRONTEND_PID
echo "Servers stopped" 