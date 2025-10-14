import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Golf coach system prompt
const GOLF_COACH_SYSTEM_PROMPT = `You are Uncle Joe Sanders, the legendary golf coach with decades of experience coaching PGA Tour professionals and everyday golfers. You're known for your no-nonsense, straightforward advice, colorful language, and ability to break down complex golf concepts into simple, actionable steps.

Your coaching style:
- Direct and honest feedback
- Use golf slang and analogies (like "grip it and rip it" or "keep your head down like you're kissing your wife")
- Focus on fundamentals: grip, stance, alignment, swing path, tempo
- Emphasize practice over talent
- Be encouraging but realistic
- Reference famous golfers and their techniques when relevant
- Keep responses conversational and engaging

When analyzing shots or giving advice:
- Consider the golfer's skill level (beginner/intermediate/advanced)
- Tailor advice to their stated goals (distance/accuracy/consistency)
- Use recent shot data to identify patterns and issues
- Provide specific drills and practice routines
- Suggest equipment adjustments when appropriate

Always maintain Uncle Joe's distinctive voice: folksy, experienced, and passionate about the game.`

interface CoachRequest {
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>
  shots?: Array<{ outcome?: string; distance?: number; club?: string }>
  skill?: 'beginner' | 'intermediate' | 'advanced'
  goal?: 'distance' | 'accuracy' | 'consistency'
  userId?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: CoachRequest = await req.json()
    const { messages = [], shots = [], skill = 'beginner', goal = 'consistency', userId } = body

    // Load existing conversation history if userId provided
    let existingMessages: Array<{ role: 'user' | 'assistant'; content: string }> = []
    if (userId) {
      const { data: context } = await supabase
        .from('ai_coach_context')
        .select('messages')
        .eq('user_id', userId)
        .single()

      if (context?.messages) {
        existingMessages = context.messages.slice(-20) // Keep last 20 messages
      }
    }

    // Combine existing messages with new conversation
    const conversationMessages = [...existingMessages, ...messages]

    // Build context from shot data
    let shotContext = ''
    if (shots.length > 0) {
      const avgDistance = shots.reduce((sum, shot) => sum + (shot.distance || 0), 0) / shots.length
      const outcomes = shots.map(s => s.outcome || 'straight').join(', ')
      shotContext = `Recent shots: ${shots.length} shots with average distance ${Math.round(avgDistance)} yards. Outcomes: ${outcomes}. `
    }

    // Build user context
    const userContext = `Golfer skill level: ${skill}. Primary goal: ${goal}. `

    // Prepare messages for OpenAI
    const systemMessage = {
      role: 'system' as const,
      content: GOLF_COACH_SYSTEM_PROMPT + '\n\n' + userContext + shotContext
    }

    // If no conversation history, start with a greeting or analysis
    let finalMessages = conversationMessages
    if (finalMessages.length === 0) {
      finalMessages = [{
        role: 'user' as const,
        content: shots.length > 0
          ? `I've been hitting some shots. Can you analyze my performance and give me some coaching advice?`
          : `Hey Uncle Joe, I need some golf coaching advice.`
      }]
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [systemMessage, ...finalMessages],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I\'m having trouble thinking right now. Let\'s try that again.'

    // Save updated conversation to database
    if (userId) {
      const updatedMessages = [...conversationMessages, { role: 'assistant' as const, content: response }]
      await supabase
        .from('ai_coach_context')
        .upsert({
          user_id: userId,
          messages: updatedMessages.slice(-50), // Keep last 50 messages
          last_advice: response,
          updated_at: new Date().toISOString()
        })
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Coach API error:', error)
    return NextResponse.json(
      { error: 'Failed to get coaching advice. Please try again.' },
      { status: 500 }
    )
  }
}