#!/bin/bash

# HerShield Docker Startup Script
echo "🛡️ Starting HerShield with Docker"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is available"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove any existing images (optional, for clean rebuild)
echo "🧹 Cleaning up old images..."
docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true

# Build and start the services
echo "🚀 Building and starting HerShield services..."
docker-compose up --build

# Note: The script will keep running to show logs
# Press Ctrl+C to stop all services
