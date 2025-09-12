import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Create OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Create Supabase client only if credentials are available
const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(req: NextRequest) {
  try {
    const { message, context, taskType = 'general' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!openai) {
      return NextResponse.json({ 
        error: 'OpenAI API not configured',
        fallback: "I appreciate your message! The AI assistant is currently not available, but I'd be happy to help you through other channels."
      }, { status: 503 });
    }

    // Get user context if available
    const authHeader = req.headers.get('authorization');
    let userContext = '';

    if (authHeader) {
      // This would be implemented with proper auth token validation
      userContext = 'Authenticated user';
    }

    const systemPrompt = `You are the Chief of Staff for professional golfer Joe Sanders.
Your role encompasses strategy, content planning, fan engagement, business development, and operational management.

Key responsibilities:
- Strategic planning and business development
- Content creation and social media strategy
- Fan engagement and community building
- Tournament preparation and logistics
- Sponsorship and partnership management
- Performance analysis and improvement planning
- Crisis management and reputation protection

Always provide concise, actionable advice. Be professional, strategic, and focused on long-term success.
Reference Joe's brand values: integrity, excellence, community, and continuous improvement.

Current context: ${context || 'General inquiry'}
User status: ${userContext || 'Anonymous user'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // Log the interaction (optional)
    try {
      if (supabase) {
        await supabase.from('cos_logs').insert({
          task_type: taskType,
          user_input: message,
          gpt_output: reply
        });
      }
    } catch (logError) {
      console.warn('Failed to log CoS interaction:', logError);
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chief of Staff API Error:', error);
    return NextResponse.json(
      { error: 'Chief of Staff is unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}