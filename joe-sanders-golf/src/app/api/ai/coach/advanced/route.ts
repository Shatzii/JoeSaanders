import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
}) : null;

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : null;

const functions = [
  {
    name: 'advanced_swing_analysis',
    description: 'Comprehensive golf shot analysis with personalized recommendations.',
    parameters: {
      type: 'object',
      properties: {
        technical_analysis: { type: 'string' },
        personalized_tip: { type: 'string' },
        drill_suggestion: { type: 'string' },
        confidence: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        detected_tendency: { type: 'string' }
      },
      required: ['technical_analysis', 'personalized_tip', 'confidence'],
    },
  }
];

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return NextResponse.json({
        response: "Advanced AI coaching features are currently unavailable. Please configure OpenAI API key for full functionality.",
        suggestions: [
          "Set up OPENAI_API_KEY environment variable",
          "Contact administrator for API key configuration"
        ]
      });
    }

    const { shotData, userId } = await req.json();

    // Get user's historical context (only if Supabase is available)
    let context = null;
    if (supabase && userId) {
      const { data } = await supabase
        .from('ai_coach_context')
        .select('*')
        .eq('user_id', userId)
        .single();
      context = data;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are Joe Sanders' AI Golf Pro Coach. Analyze this shot with context: ${context?.tendency ? `Player tends to ${context.tendency}.` : ''} ${context?.last_advice ? `Last advice given: ${context.last_advice}` : ''}`
        },
        {
          role: "user",
          content: `Analyze this shot in detail: ${JSON.stringify(shotData)}`
        }
      ],
      functions: functions,
      function_call: { name: 'advanced_swing_analysis' },
      max_tokens: 500,
    });

    const functionCall = response.choices[0].message.function_call;
    if (functionCall && functionCall.name === 'advanced_swing_analysis') {
      const analysis = JSON.parse(functionCall.arguments);

      // Save this analysis to context for future recommendations (only if Supabase is available)
      if (supabase) {
        await supabase
          .from('ai_coach_context')
          .upsert({
            user_id: userId,
            tendency: analysis.detected_tendency || context?.tendency,
            last_advice: analysis.personalized_tip,
            updated_at: new Date().toISOString()
          });
      }

      return NextResponse.json(analysis);
    }

    return NextResponse.json({ error: 'No analysis generated' }, { status: 500 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}