#!/bin/bash

# 🚀 Joe Sanders Golf - Netlify Deployment Script
# Quick deployment preparation and push to GitHub

echo "🎯 Preparing Joe Sanders Golf for Netlify deployment..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint --fix

# Test build locally
echo "🔨 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Add all changes
echo "📝 Staging changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "🚀 Prepare for Netlify deployment

✅ Configured Netlify settings
✅ Added deployment guide
✅ Updated Next.js config for static export
✅ Added redirects configuration
✅ Ready for production deployment"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin copilot/vscode1758026245338

echo "✅ Deployment preparation complete!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to netlify.com and connect your GitHub repository"
echo "2. Select the branch: copilot/vscode1758026245338"
echo "3. Add environment variables (see NETLIFY_DEPLOYMENT_GUIDE.md)"
echo "4. Deploy and test!"
echo ""
echo "📚 Full guide: ./NETLIFY_DEPLOYMENT_GUIDE.md"