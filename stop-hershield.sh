#!/bin/bash

# HerShield - Stop Script
echo "🛑 Stopping HerShield Safety Platform"
echo "====================================="

# Kill processes using stored PIDs
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    echo "🔄 Stopping Backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || echo "   Backend already stopped"
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    echo "🔄 Stopping Frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || echo "   Frontend already stopped"
    rm logs/frontend.pid
fi

# Cleanup any remaining processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "nodemon.*hershield" 2>/dev/null || true
pkill -f "vite.*hershield" 2>/dev/null || true
pkill -f "ts-node.*server.ts" 2>/dev/null || true

echo "✅ All HerShield services stopped"
echo ""
echo "💡 MongoDB is still running (use 'brew services stop mongodb-community@7.0' to stop it)"
echo "🚀 To restart HerShield, run: ./start-hershield.sh"
echo ""
