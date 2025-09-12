#!/bin/bash

# Voice Coaching Setup Script for Uncle Joe's Golf Simulator
echo "🎙️ Setting up Uncle Joe's Voice Coaching Integration"
echo "=================================================="

# Check if ElevenLabs API key is set
if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo "⚠️  ELEVENLABS_API_KEY not found in environment variables"
    echo "Please add your ElevenLabs API key to .env.local:"
    echo "ELEVENLABS_API_KEY=your_api_key_here"
    echo ""
    echo "Get your API key from: https://elevenlabs.io/app/profile"
    exit 1
fi

echo "✅ ElevenLabs API key found"

# Check if voice ID is configured
VOICE_ID=$(grep "UNCLE_JOE_VOICE_ID" src/lib/elevenlabs.ts | cut -d'"' -f2)
if [ "$VOICE_ID" = "your-uncle-joe-voice-id-here" ]; then
    echo "⚠️  Uncle Joe voice ID not configured"
    echo "Please:"
    echo "1. Go to https://elevenlabs.io/app/voices"
    echo "2. Create a new voice model for Uncle Joe"
    echo "3. Copy the Voice ID and update UNCLE_JOE_VOICE_ID in src/lib/elevenlabs.ts"
    echo ""
    echo "Example voice creation:"
    echo "- Upload audio samples of coaching instructions"
    echo "- Use settings: Age 60-70, Style: Coaching/Inspirational"
    echo "- Fine-tune for golf terminology and Southern accent"
else
    echo "✅ Uncle Joe voice ID configured: $VOICE_ID"
fi

echo ""
echo "🎯 Voice Coaching Features:"
echo "- Real-time swing analysis and feedback"
echo "- Personalized coaching based on shot metrics"
echo "- Toggle voice on/off in simulator"
echo "- Fallback to browser speech synthesis"
echo ""

echo "🚀 Ready to test voice coaching!"
echo "Run: npm run dev"
echo "Navigate to: http://localhost:3000/simulator"
echo "Take a swing and listen for Uncle Joe's coaching!"