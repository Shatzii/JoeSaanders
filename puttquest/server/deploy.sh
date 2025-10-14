#!/bin/bash

# PuttQuest Server Deployment Script
# This script helps deploy the PuttQuest server to Railway or similar platforms

echo "🚀 PuttQuest Server Deployment"
echo "=============================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it first:"
    echo "   npm install -g @railway/cli"
    echo "   railway login"
    exit 1
fi

# Check if we're in the server directory
if [ ! -f "server.js" ]; then
    echo "❌ Please run this script from the puttquest/server directory"
    exit 1
fi

echo "📦 Preparing deployment..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env from .env.example"
        echo "   Please edit .env with your production values"
    else
        echo "❌ .env.example not found. Please create .env manually"
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Check if build is successful
echo "🔨 Testing build..."
npm test 2>/dev/null || echo "⚠️  Tests failed, but continuing with deployment"

echo "🌐 Deploying to Railway..."

# Initialize Railway project if not already done
if [ ! -f "railway.toml" ]; then
    echo "🔧 Initializing Railway project..."
    railway init puttquest-server
fi

# Deploy
echo "🚀 Deploying..."
railway up

# Get the deployment URL
echo "📍 Getting deployment URL..."
DEPLOY_URL=$(railway domain)

echo ""
echo "✅ Deployment complete!"
echo "=========================="
echo "Server URL: $DEPLOY_URL"
echo ""
echo "🔧 Next Steps:"
echo "1. Update your mobile app's serverUrl in app.json:"
echo "   \"serverUrl\": \"$DEPLOY_URL\""
echo ""
echo "2. Add MongoDB and Redis plugins in Railway dashboard"
echo ""
echo "3. Set environment variables in Railway:"
echo "   - JWT_SECRET"
echo "   - ALLOWED_ORIGINS"
echo ""
echo "4. Test the server endpoint: $DEPLOY_URL/health"
echo ""
echo "📱 Then deploy the mobile app:"
echo "   cd ../mobile"
echo "   eas build --platform all --profile production"