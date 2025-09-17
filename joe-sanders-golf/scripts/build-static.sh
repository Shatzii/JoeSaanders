#!/bin/bash
# 🚀 Static Export Build Script for Netlify
# This script temporarily removes API routes to enable static export

echo "🔧 Preparing for static export build..."

# Create backup of API routes in a different location
if [ -d "src/app/api" ]; then
  echo "📦 Backing up API routes..."
  mkdir -p backup-temp
  mv src/app/api backup-temp/
fi

# Run the build
echo "🏗️ Building static export..."
npm run build

# Build status
BUILD_STATUS=$?

# Restore API routes
if [ -d "backup-temp/api" ]; then
  echo "🔄 Restoring API routes..."
  mv backup-temp/api src/app/
  rm -rf backup-temp
fi

# Check build result
if [ $BUILD_STATUS -eq 0 ]; then
  echo "✅ Static export build successful!"
  echo "📁 Static files are in the 'out' directory"
  ls -la out/
else
  echo "❌ Build failed with exit code $BUILD_STATUS"
  exit $BUILD_STATUS
fi