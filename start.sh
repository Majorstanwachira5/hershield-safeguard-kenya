#!/bin/bash

# HerShield Startup Script
echo "🛡️ Starting HerShield - Digital Safety Platform"
echo "============================================"

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! mongo --eval "db.adminCommand('ismaster')" >/dev/null 2>&1; then
  echo "⚠️  MongoDB not running. Please start MongoDB first:"
  echo "   brew services start mongodb/brew/mongodb-community"
  echo "   or run: mongod"
  exit 1
fi

echo "✅ MongoDB is running"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed. Please install npm first."
  exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

# Create .env files if they don't exist
if [ ! -f ".env" ]; then
  echo "🔧 Creating frontend .env file..."
  echo "VITE_API_BASE_URL=http://localhost:5000" > .env
fi

if [ ! -f "backend/.env" ]; then
  echo "🔧 Creating backend .env file from template..."
  cp backend/.env.example backend/.env
  echo "⚠️  Please update backend/.env with your configuration"
fi

echo ""
echo "🚀 Starting HerShield application..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔗 Backend API will be available at: http://localhost:5000"
echo "📋 API Health Check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Function to cleanup background processes
cleanup() {
  echo ""
  echo "🛑 Stopping HerShield..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "✅ HerShield stopped successfully"
  exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🔧 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
echo "🔍 Checking backend health..."
if curl -s http://localhost:5000/health > /dev/null; then
  echo "✅ Backend is running successfully"
else
  echo "⚠️  Backend may still be starting up..."
fi

# Start frontend
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait
