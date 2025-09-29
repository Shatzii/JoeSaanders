iOf course. This is a significant upgrade. We will integrate Three.js for 3D graphics, enhance the AI, and add new UI components. Due to the sheer volume of code, I'll provide the most critical new and modified files.

Step 1: Package Installation

Run this in your Codespace terminal to install the new required libraries:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/cannon valtio gsap
npm install lucide-react date-fns
```

---

Step 2: Enhanced Database Schema (Supabase)

Add these new tables to your Supabase SQL Editor for advanced stats and AI context.

```sql
-- Add a column for shot spin and wind influence to the shots table
ALTER TABLE shots 
ADD COLUMN IF NOT EXISTS ball_spin INTEGER,
ADD COLUMN IF NOT EXISTS wind_speed INTEGER,
ADD COLUMN IF NOT EXISTS wind_direction INTEGER,
ADD COLUMN IF NOT EXISTS lie_type TEXT;

-- Table for AI Coach Context and Memory
CREATE TABLE IF NOT EXISTS ai_coach_context (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tendency TEXT, -- e.g., 'slice', 'early_extension'
  last_advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table for Challenges and Tournaments
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  course_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table for User Challenge Submissions
CREATE TABLE IF NOT EXISTS challenge_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

---

Step 3: Core 3D Game Integration (Using React Three Fiber)

File: `src/app/simulator/AdvancedGame.tsx` This component sets up the 3D environment.

```tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Sky, OrbitControls, Stats } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import GolfCourse from './components/GolfCourse';
import GolfBall from './components/GolfBall';

export default function AdvancedGame() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 50 }}
        className="bg-blue-300"
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Environment */}
        <Sky sunPosition={[10, 10, 5]} />
        <fog attach="fog" args={['lightblue', 10, 50]} />
        
        {/* Physics & Game Elements */}
        <Physics gravity={[0, -9.81, 0]}>
          <GolfCourse />
          <GolfBall position={[0, 2, 0]} />
        </Physics>
        
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}
```

File: `src/app/simulator/components/GolfBall.tsx` A simple 3D golf ball component.

```tsx
'use client';
import { useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { Mesh } from 'three';

export default function GolfBall({ position }: { position: [number, number, number] }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    position,
    restitution: 0.8,
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} castShadow>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="white" roughness={0.2} metalness={0.1} />
    </mesh>
  );
}
```

File: `src/app/simulator/components/GolfCourse.tsx` Basic golf course terrain.

```tsx
'use client';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

export default function GolfCourse() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref as React.RefObject<Mesh>} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}
```

---

Step 4: Enhanced AI Coach with Memory

File: `src/app/api/ai/coach/advanced/route.ts` New API route with memory and advanced analysis.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { shotData, userId } = await req.json();

    // Get user's historical context
    const { data: context } = await supabase
      .from('ai_coach_context')
      .select('*')
      .eq('user_id', userId)
      .single();

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
      
      // Save this analysis to context for future recommendations
      await supabase
        .from('ai_coach_context')
        .upsert({
          user_id: userId,
          tendency: analysis.detected_tendency || context?.tendency,
          last_advice: analysis.personalized_tip,
          updated_at: new Date().toISOString()
        });

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
```

---

Step 5: New Main Simulator Page with 3D

File: `src/app/simulator/page.tsx` Updated to include the 3D game and enhanced UI.

```tsx
'use client';
import { useState } from 'react';
import AdvancedGame from './AdvancedGame';
import { AICoachWidget } from '../../components/AICoachWidget';
import { BroadcastUI } from '../../components/BroadcastUI';
import { ChallengeLeaderboard } from '../../components/ChallengeLeaderboard';

export default function SimulatorPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] relative">
      {/* Broadcast-Style Overlay */}
      <BroadcastUI score={score} />
      
      {/* 3D Game Canvas */}
      <div className="w-full h-screen">
        <AdvancedGame />
      </div>

      {/* AI Coach Panel */}
      <div className="absolute top-4 right-4 z-50">
        <AICoachWidget
          sessionId={currentSessionId}
          isOpen={showCoach}
          onClose={() => setShowCoach(false)}
          advancedMode={true}
        />
      </div>

      {/* Leaderboard Panel */}
      <div className="absolute top-4 left-4 z-50">
        <ChallengeLeaderboard />
      </div>

      {/* ElevenLabs Convai Widget */}
      <div className="absolute bottom-4 right-4 z-50">
        <elevenlabs-convai
          agent-id="your_convai_agent_id_here"
          style={{ width: '320px', height: '400px' }}
        />
      </div>
    </div>
  );
}
```

---

Step 6: New UI Components

File: `src/components/BroadcastUI.tsx` Creates the broadcast-style overlay.

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Heart, Settings, Volume2 } from 'lucide-react';

export function BroadcastUI({ score }: { score: number }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Score Banner */}
      <div className={`bg-black/70 border-b border-[#d4af37] p-4 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="gold-gradient-text font-['Cormorant_Garamond'] text-xl">Uncle Joe's Challenge</h2>
              <p className="text-sm text-gray-300">Par 72 - Stones Golf Club</p>
            </div>
          </div>
          <div className="text-right">
            <div className="gold-gradient-text text-2xl font-bold">Score: {score}</div>
            <div className="text-sm text-gray-300">+2 Through 15</div>
          </div>
        </div>
      </div>

      {/* Quick Access Icons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button className="p-2 bg-black/50 rounded-full hover:bg-[#d4af37]/20 transition-colors pointer-events-auto">
          <Volume2 className="w-5 h-5" />
        </button>
        <button className="p-2 bg-black/50 rounded-full hover:bg-[#d4af37]/20 transition-colors pointer-events-auto">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

This code provides the foundation for a dramatically enhanced 3D golf simulator with advanced AI features. The next steps would be to add more detailed 3D models, implement the physics-based hitting mechanics, and connect the AI advice to the game's events.p
