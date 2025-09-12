#!/bin/bash

# Uncle Joe's Golf - AI Features Setup Script
# This script helps set up all the AI integrations for the golf platform

echo "🤖 Setting up Uncle Joe's AI Golf Platform..."
echo "=============================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please fill in your API keys!"
    echo ""
fi

# Install dependencies
echo "📦 Installing AI dependencies..."
npm install phaser openai

# Check for required environment variables
echo ""
echo "🔧 Checking environment variables..."

REQUIRED_VARS=(
    "OPENAI_API_KEY"
    "ELEVENLABS_API_KEY"
    "ELEVENLABS_VOICE_ID"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" .env.local 2>/dev/null || grep "^$var=" .env.local | grep -q "your_.*_here"; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Missing or placeholder environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "📝 Please update .env.local with your actual API keys:"
    echo "   1. OpenAI: https://platform.openai.com/api-keys"
    echo "   2. ElevenLabs: https://elevenlabs.io/app/profile"
    echo "   3. Supabase: https://supabase.com/dashboard"
    echo ""
else
    echo "✅ All required environment variables are configured!"
fi

# Database setup instructions
echo "🗄️  Database Setup:"
echo "   Run the SQL in scripts/schema.sql in your Supabase dashboard"
echo "   Or use: supabase db push (if CLI is configured)"
echo ""

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Ready to start the development server:"
    echo "   npm run dev"
    echo ""
    echo "📱 Access your AI-powered golf simulator at:"
    echo "   http://localhost:3000/simulator"
    echo ""
    echo "🤖 AI Features:"
    echo "   • GPT-4 Golf Coach with voice feedback"
    echo "   • ElevenLabs Conversational Caddie"
    echo "   • Chief of Staff AI for business strategy"
    echo "   • Advanced Phaser.js golf simulator"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Configure your ElevenLabs voice clone"
    echo "   2. Set up Convai agent for conversational AI"
    echo "   3. Test the golf simulator with AI coaching"
    echo "   4. Deploy to production when ready!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi