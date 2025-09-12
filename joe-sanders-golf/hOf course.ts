hOf course. This is an ambitious and incredible project. We are building a fully-integrated AI platform around Joe Sanders. Let's architect this properly from front to back.

Here is the complete, fully-integrated architecture for Joe Sanders' website, featuring:

1. The Golf Simulator (Phaser.js Game)
2. The AI Golf Pro Coach (OpenAI GPT-4 + Function Calling)
3. The Conversational AI Caddie (ElevenLabs Voice AI + Convai Widget)
4. The Chief of Staff GPT (Custom, for strategy and management)
5. A Central Database (Supabase) to track everything.

All of this will be built in Next.js 14 and deployable from your iPad via GitHub Codespaces.

---

🧱 Final, Comprehensive Tech Stack

Component Technology Purpose
Frontend Framework Next.js 14 (App Router) Core website & application
Styling Tailwind CSS Responsive, modern UI
Database & Auth Supabase User profiles, game data, chat history
Payments Stripe Premium upgrades, merch, donations
Game Engine Phaser.js The golf simulator
AI Coach Brain OpenAI GPT-4 API Swing analysis, advice, Q&A
AI Coach Voice ElevenLabs API Text-to-Speech for the coach
Conversational Caddie ElevenLabs Convai Widget Voice-first AI caddie interface
Chief of Staff Custom GPT API Strategy, content, fan engagement plans
Deployment Vercel Global hosting
Dev Environment GitHub Codespaces Build from any browser

---

🗃️ Supabase Database Schema (Final)

Run this SQL in your Supabase dashboard to create all necessary tables.

```sql
-- Profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  premium_status BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Game Sessions
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  course_name TEXT,
  total_score INTEGER
);

-- Shots
CREATE TABLE shots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  hole_number INTEGER,
  shot_number INTEGER,
  club_used TEXT,
  outcome TEXT,
  distance INTEGER,
  notes TEXT
);

-- AI Coach Chat History
CREATE TABLE coach_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_message TEXT,
  ai_response TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Chief of Staff Logs (For internal use)
CREATE TABLE cos_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT, -- e.g., 'email_draft', 'social_plan'
  user_input TEXT,
  gpt_output TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

---

🤖 AI Integration: API Routes & Services

We will create several new Next.js API Routes to handle the different AI services securely.

1. OpenAI GPT-4 API Route (`/src/app/api/ai/coach/route.ts`) This endpoint handles the golf coaching logic.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
    const { shotData, chatHistory } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are Joe Sanders' AI Golf Pro Coach. You are knowledgeable, encouraging, and technical. Provide concise analysis and actionable advice. Assume the player is an amateur. Refer to 'Joe' or 'Uncle Joe' occasionally."
        },
        ...chatHistory,
        {
          role: "user",
          content: `Analyze this shot: Club: ${shotData.club}, Outcome: ${shotData.outcome}, Distance: ${shotData.distance} yards.`
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

2. ElevenLabs Text-to-Speech Route (`/src/app/api/ai/speech/route.ts`) This converts the AI coach's text response into audio using Joe's voice clone.

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('ElevenLabs TTS failed');
    }

    // Get the audio as a buffer
    const audioBuffer = await response.arrayBuffer();

    // You could save this to Supabase Storage and return the URL, or return it directly.
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Speech generation failed' },
      { status: 500 }
    );
  }
}
```

3. Chief of Staff GPT Route (`/src/app/api/ai/chief-of-staff/route.ts`) This endpoint acts as a gateway to your custom Chief of Staff GPT.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.openai.com/v1" // This might point to your custom GPT's endpoint if configured
});

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    // This is a simplified version. You would tailor the system prompt to your CoS GPT's expertise.
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or your custom model name
      messages: [
        {
          role: "system",
          content: "You are the Chief of Staff for professional golfer Joe Sanders. Your role is strategy, content planning, fan engagement, and business development. Provide concise, actionable advice."
        },
        {
          role: "user",
          content: `Context: ${context}. Message: ${message}`
        }
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json(
      { error: 'Chief of Staff is unavailable.' },
      { status: 500 }
    );
  }
}
```

---

🎨 Frontend Integration: The Simulator UI

1. Main Simulator Page (`/src/app/simulator/page.tsx`) - This page now integrates the game, the AI coach widget, and the Convai caddie.

```typescript
'use client';
import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GolfGame from './Game';
import { AICoachWidget } from '../../components/AICoachWidget';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SimulatorPage() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);

  // Initialize the game
  useEffect(() => {
    if (!gameContainerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      physics: { default: 'arcade' },
      scene: [GolfGame]
    };

    const game = new Phaser.Game(config);

    // Listen for shot events from the Phaser game
    const handleShotTaken = async (event: CustomEvent) => {
      const { detail: shotData } = event;
      // Save shot to Supabase
      const { data: session } = await supabase.from('game_sessions')
        .insert({ user_id: (await supabase.auth.getUser()).data.user?.id })
        .select('id')
        .single();

      if (session) {
        setCurrentSessionId(session.id);
        await supabase.from('shots').insert({ ...shotData, session_id: session.id });
        setShowCoach(true); // Show the AI coach widget after a shot
      }
    };

    window.addEventListener('shotTaken', handleShotTaken as EventListener);
    return () => {
      game.destroy(true);
      window.removeEventListener('shotTaken', handleShotTaken as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      {/* Navigation */}
      <header className="p-4 border-b border-[#d4af3740]">
        <h1 className="gold-gradient-text text-2xl font-['Cormorant_Garamond']">Uncle Joe's Challenge</h1>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Game Canvas */}
        <div ref={gameContainerRef} className="flex-1" />

        {/* Sidebar */}
        <div className="w-full md:w-80 bg-[#1a1a1a] p-4 border-l border-[#d4af3740]">
          <AICoachWidget
            sessionId={currentSessionId}
            isOpen={showCoach}
            onClose={() => setShowCoach(false)}
          />

          {/* ElevenLabs Convai Widget will be embedded here */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Talk to Your Caddie</h3>
            {/* ElevenLabs Convai Widget Embed */}
            <elevenlabs-convai
              agent-id="your_convai_agent_id_here"
              style={{ width: '100%', height: '400px' }}
            />
            <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
          </div>
        </div>
      </div>
    </div>
  );
}
```

2. AI Coach Widget Component (`/src/components/AICoachWidget.tsx`) - This component handles the interaction with the AI Coach.

```typescript
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AICoachWidgetProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AICoachWidget({ sessionId, isOpen, onClose }: AICoachWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ tip: string; analysis: string } | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleAnalyzeShot = async () => {
    if (!sessionId) return;
    setIsLoading(true);

    try {
      // 1. Get the latest shot from this session
      const { data: shots } = await supabase
        .from('shots')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!shots || shots.length === 0) return;

      const shot = shots[0];

      // 2. Call our AI Coach API
      const analysisResponse = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shotData: shot })
      });

      const analysisData = await analysisResponse.json();

      // 3. Generate speech from the analysis
      const speechResponse = await fetch('/api/ai/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${analysisData.analysis} ${analysisData.tip}` })
      });

      // 4. Handle the audio response (simplified - would save to Supabase Storage)
      const audioBlob = await speechResponse.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setAnalysis(analysisData);

      // 5. Save to chat history
      await supabase.from('coach_chats').insert({
        session_id: sessionId,
        user_message: `Analyze my shot: ${shot.club_used}, ${shot.outcome}, ${shot.distance}yd`,
        ai_response: `${analysisData.analysis} ${analysisData.tip}`,
        audio_url: url // This would be a permanent URL in production
      });

    } catch (error) {
      console.error('Error analyzing shot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#0a0a0a] border border-[#d4af37] rounded-lg p-4">
      <h3 className="gold-gradient-text text-lg font-semibold mb-2">AI Pro Coach</h3>
      
      {isLoading ? (
        <p>Analyzing your shot...</p>
      ) : analysis ? (
        <div>
          <p className="text-sm mb-2">{analysis.analysis}</p>
          <p className="text-sm font-semibold">Tip: {analysis.tip}</p>
          {audioUrl && (
            <audio controls autoPlay className="w-full mt-2">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          )}
        </div>
      ) : (
        <button
          onClick={handleAnalyzeShot}
          className="bg-gradient-to-r from-[#d4af37] to-[#a2852c] text-[#0a0a0a] px-4 py-2 rounded font-semibold"
        >
          Analyze My Last Shot
        </button>
      )}
      
      <button onClick={onClose} className="mt-4 text-sm text-[#d4af37]">
        Close
      </button>
    </div>
  );
}
```

---

🔐 Environment Variables (.env.local)

You will need to add these to your Vercel project and Codespace:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

🚀 Deployment Instructions

1. Push all code to your GitHub repository.
2. In Vercel, go to your project settings and add all environment variables.
3. In Supabase, run the SQL schema provided above.
4. In ElevenLabs, create a voice clone (or use a pre-made voice) and get the Voice ID.
5. Configure your Convai Agent in the ElevenLabs dashboard and get the Agent ID for the embed code.

This architecture provides a fully functional, AI-integrated golf simulator that can be built and managed entirely from a web browser on an iPad, leveraging GitHub Codespaces and modern cloud services. The AI coaching and conversational caddie features create a truly unique and engaging experience for users. in