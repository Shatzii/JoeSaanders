#!/bin/bash

echo "Testing AI Golf Tutor API..."

# Test the AI coach endpoint
response=$(curl -s -X POST http://localhost:3000/api/ai/coach \
  -H "Content-Type: application/json" \
  -d '{"shotData":{"club_used":"Driver","outcome":"Good","distance":250}}')

echo "API Response:"
echo "$response" | jq '.' 2>/dev/null || echo "$response"

# Check if we got a proper response
if echo "$response" | grep -q "analysis"; then
    echo "✅ AI Coach API is working!"
else
    echo "❌ AI Coach API is not working properly"
fi