#!/bin/bash

# HerShield - Simple Setup Script
echo "🛡️  Starting HerShield Safety Platform"
echo "===================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Starting MongoDB..."
    brew services start mongodb-community@7.0
    sleep 3
else
    echo "✅ MongoDB is already running"
fi

# Check MongoDB connection
echo "🔍 Checking MongoDB connection..."
if mongosh --eval "db.runCommand('ping')" --quiet hershield > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful"
else
    echo "⚠️  MongoDB connection failed, but continuing..."
fi

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "nodemon.*hershield" 2>/dev/null || true
pkill -f "vite.*hershield" 2>/dev/null || true

# Start Backend
echo "🚀 Starting Backend Server..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a moment for backend to initialize
sleep 3

# Start Frontend  
echo "🚀 Starting Frontend Server..."
cd ..
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

# Create logs directory if it doesn't exist
mkdir -p logs

# Save process IDs for easy cleanup later
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo "🎉 HerShield is starting up!"
echo "📱 Frontend: http://localhost:3001"
echo "🔧 Backend:  http://localhost:5050"
echo "💾 MongoDB:  mongodb://localhost:27017/hershield"
echo ""
echo "📋 Process IDs saved to logs/ directory"
echo "🛑 To stop all services, run: ./stop-hershield.sh"
echo ""
echo "⏳ Waiting for services to fully initialize..."
sleep 5

# Check if services are responding
echo "🔍 Health Check:"
if curl -s http://localhost:5050/health > /dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "⚠️  Backend API not responding yet (may need a moment)"
fi

if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "⚠️  Frontend not responding yet (may need a moment)"
fi

echo ""
echo "🚀 HerShield is ready!"
echo "   Navigate to: http://localhost:3001"
echo ""
echo "📖 Available features:"
echo "   • Dashboard: http://localhost:3001/dashboard"
echo "   • Safety Center: http://localhost:3001/safety"
echo "   • AI Safety Hub: http://localhost:3001/ai"
echo ""
