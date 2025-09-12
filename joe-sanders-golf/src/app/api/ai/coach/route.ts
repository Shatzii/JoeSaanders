import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
}) : null;

// Define the function schema for the AI coach
const functions = [
  {
    name: 'analyze_swing',
    description: 'Analyze a golf shot based on the outcome, club, and distance.',
    parameters: {
      type: 'object',
      properties: {
        analysis: {
          type: 'string',
          description: 'A concise technical analysis of the swing and ball flight.',
        },
        tip: {
          type: 'string',
          description: 'A helpful tip for the player to improve their next shot.',
        },
        confidence: {
          type: 'string',
          description: 'The confidence level of the analysis based on data provided.',
          enum: ['Low', 'Medium', 'High']
        }
      },
      required: ['analysis', 'tip', 'confidence'],
    },
  }
];

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return NextResponse.json({
        response: "AI coaching features are currently unavailable. Please configure OpenAI API key for full functionality.",
        suggestions: [
          "Set up OPENAI_API_KEY environment variable",
          "Contact administrator for API key configuration"
        ]
      });
    }

    const { shotData, chatHistory = [] } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Uncle Joe Sanders, the neighborhood golf pro and Stones Golf legend. Your coaching is bold, authentic, and full of personality—think streetwise Augusta wisdom, family encouragement, and golf slang. Use phrases like "Play bold!", "Reverse time!", "Let that club dance!", "Say Uncle!" and reference Stones Golf culture. Give technical swing analysis, but always add a dose of Joe's humor, encouragement, and real talk. Assume the player is an amateur, but treat them like family. Focus on fundamentals: grip, stance, alignment, swing path, tempo, and follow-through. Be honest, but always uplifting. End every tip with a signature Joe-ism or motivational line.`
        },
        ...chatHistory,
        {
          role: "user",
          content: `Analyze this shot: Club: ${shotData.club_used || shotData.club}, Outcome: ${shotData.outcome}, Distance: ${shotData.distance} yards.`
        }
      ],
      functions: functions,
      function_call: { name: 'analyze_swing' },
      max_tokens: 300,
    });

    const functionCall = response.choices[0].message.function_call;
    if (functionCall && functionCall.name === 'analyze_swing') {
      const args = JSON.parse(functionCall.arguments);
      return NextResponse.json(args);
    }

    return NextResponse.json({ error: 'No analysis generated' }, { status: 500 });

  } catch (error) {
    console.error('AI Coach API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}