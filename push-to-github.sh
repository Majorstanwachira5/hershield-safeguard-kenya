#!/bin/bash

echo "🚀 HerShield - Push to GitHub"
echo "=============================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository"
    exit 1
fi

# Check current status
echo "📋 Current Git Status:"
git status --short

echo ""
echo "🌐 Repository URL:"
git remote get-url origin

echo ""
echo "📝 Recent Commits:"
git log --oneline -3

echo ""
echo "🔑 GitHub Authentication Options:"
echo "1. Use GitHub CLI (Recommended)"
echo "2. Use Personal Access Token"
echo "3. Use SSH (if configured)"
echo ""

read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo "Installing GitHub CLI..."
        if ! command -v gh &> /dev/null; then
            if command -v brew &> /dev/null; then
                brew install gh
            else
                echo "❌ Homebrew not found. Please install GitHub CLI manually:"
                echo "   https://cli.github.com/"
                exit 1
            fi
        fi
        
        echo "🔐 Authenticating with GitHub..."
        gh auth login
        
        if gh auth status &> /dev/null; then
            echo "✅ Authentication successful!"
            echo "🚀 Pushing to GitHub..."
            git push origin main
            
            if [ $? -eq 0 ]; then
                echo "🎉 Successfully pushed to GitHub!"
                echo "🌐 Your repository is now public at:"
                git remote get-url origin
            else
                echo "❌ Push failed. Please check your permissions."
            fi
        else
            echo "❌ Authentication failed"
        fi
        ;;
    2)
        echo "📝 Please create a Personal Access Token:"
        echo "   1. Go to: https://github.com/settings/tokens"
        echo "   2. Click 'Generate new token (classic)'"
        echo "   3. Select scopes: repo, workflow"
        echo "   4. Copy the token"
        echo ""
        echo "🚀 Now pushing to GitHub..."
        echo "   When prompted for password, paste your token"
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "🎉 Successfully pushed to GitHub!"
            echo "🌐 Your repository is now public at:"
            git remote get-url origin
        else
            echo "❌ Push failed. Please check your token and permissions."
        fi
        ;;
    3)
        echo "🔑 Using SSH authentication..."
        # Convert HTTPS to SSH URL
        HTTPS_URL=$(git remote get-url origin)
        SSH_URL=$(echo $HTTPS_URL | sed 's/https:\/\/github.com\//git@github.com:/')
        
        echo "🔄 Converting to SSH URL: $SSH_URL"
        git remote set-url origin $SSH_URL
        
        echo "🚀 Pushing to GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "🎉 Successfully pushed to GitHub!"
            echo "🌐 Your repository is now public at:"
            echo $HTTPS_URL
        else
            echo "❌ Push failed. Please check your SSH key setup."
            echo "   Convert back to HTTPS:"
            git remote set-url origin $HTTPS_URL
        fi
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ HerShield is now available on GitHub!"
echo "📱 Features included:"
echo "   • AI-powered threat detection"
echo "   • Android/mobile compatible"
echo "   • One-command setup"
echo "   • Kenya-specific integrations"
echo "   • Complete documentation"
echo ""
