#!/bin/bash

echo "🚀 HerShield Deployment Script"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory"
    exit 1
fi

echo "📋 Available deployment options:"
echo "1. 🔵 Vercel (Frontend)"
echo "2. 🟢 Netlify (Frontend)" 
echo "3. 🚂 Railway (Backend)"
echo "4. 🌐 Deploy All (Frontend + Backend)"
echo ""

read -p "Choose option (1-4): " choice

case $choice in
    1)
        echo "🔵 Deploying to Vercel..."
        
        # Install Vercel CLI if not present
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Build the project
        echo "🔨 Building project..."
        npm run build
        
        # Deploy to Vercel
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        
        echo "✅ Vercel deployment complete!"
        echo "🌐 Your app will be available at: https://hershield-safeguard-kenya.vercel.app"
        ;;
    2)
        echo "🟢 Deploying to Netlify..."
        
        # Install Netlify CLI if not present
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # Build the project
        echo "🔨 Building project..."
        npm run build
        
        # Deploy to Netlify
        echo "🚀 Deploying to Netlify..."
        netlify deploy --prod --dir=dist --site=hershield-safeguard-kenya
        
        echo "✅ Netlify deployment complete!"
        echo "🌐 Your app will be available at: https://hershield-safeguard-kenya.netlify.app"
        ;;
    3)
        echo "🚂 Deploying backend to Railway..."
        
        # Install Railway CLI if not present
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        # Login and deploy
        echo "🔑 Please login to Railway..."
        railway login
        
        echo "🚀 Deploying backend..."
        railway up
        
        echo "✅ Railway deployment complete!"
        echo "🌐 Your API will be available at: https://hershield-backend.railway.app"
        ;;
    4)
        echo "🌐 Deploying full application..."
        
        # Deploy backend first
        echo "📡 Step 1: Deploying backend to Railway..."
        if ! command -v railway &> /dev/null; then
            npm install -g @railway/cli
        fi
        railway login
        railway up
        
        # Deploy frontend to Vercel
        echo "🎨 Step 2: Deploying frontend to Vercel..."
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        npm run build
        vercel --prod
        
        echo "🎉 Full deployment complete!"
        echo "🌐 Frontend: https://hershield-safeguard-kenya.vercel.app"
        echo "📡 Backend: https://hershield-backend.railway.app"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📱 Your HerShield app is now live and accessible on:"
echo "   ✅ Android devices"
echo "   ✅ iOS devices" 
echo "   ✅ Desktop browsers"
echo "   ✅ Mobile browsers"
echo ""
echo "🛡️ Features available online:"
echo "   • AI Message Analyzer"
echo "   • Safety Advisor"
echo "   • Emergency Center"
echo "   • Kenya-specific resources"
echo ""
