'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { Play, Video, MessageCircle, BookOpen, Calendar, Volume2 } from 'lucide-react'
import SwingCapture from '@/components/SwingCapture'
import { ShotHistory } from '@/components/ShotHistory'
import { PerformanceMetrics } from '@/components/PerformanceMetrics'
import { ConvaiCaddie } from '@/components/ConvaiCaddie'
import Link from 'next/link'

// Lazy load the heavy simulator bundle client-side only
const GolfSimulatorWithAnalysis = dynamic(() => import('@/components/GolfSimulatorWithAnalysis'), { ssr: false })

type PlanDay = {
  day: number
  focus: string
  drills: string[]
  notes?: string
}

type PlanResponse = {
  days: PlanDay[]
  checkpoints: string[]
}

export default function TutorInteractive() {
  const [demoEnabled, setDemoEnabled] = useState(true)
  type Shot = { distance?: number; outcome?: string; club?: string; angle?: number; force?: number; timestamp?: number }
  const [shots, setShots] = useState<Shot[]>([])
  const [showCaddie, setShowCaddie] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [plan, setPlan] = useState<PlanResponse | null>(null)
  const [skill, setSkill] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [goal, setGoal] = useState<'distance' | 'accuracy' | 'consistency'>('consistency')
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: string; audio?: string }>>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [loadingChat, setLoadingChat] = useState(false)
  const [playingAudio, setPlayingAudio] = useState(false)

  // Restore onboarding preferences
  useEffect(() => {
    try {
      const s = window.localStorage.getItem('tutor:skill');
      const g = window.localStorage.getItem('tutor:goal');
      if (s === 'beginner' || s === 'intermediate' || s === 'advanced') setSkill(s)
      if (g === 'distance' || g === 'accuracy' || g === 'consistency') setGoal(g)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      window.localStorage.setItem('tutor:skill', skill)
      window.localStorage.setItem('tutor:goal', goal)
    } catch {}
  }, [skill, goal])

  // Compute quick stats for PerformanceMetrics
  type Stats = { totalShots: number; averageDistance: number; bestShot: number; accuracy: number }
  const stats: Stats = useMemo(() => {
    const totalShots = shots.length
    const distances = shots.map((s) => s.distance || 0)
    const averageDistance = totalShots ? Math.round(distances.reduce((a, b) => a + b, 0) / totalShots) : 0
    const bestShot = distances.length ? Math.max(...distances) : 0
    const accuracy = totalShots
      ? Math.round(
          (shots.filter((s) => (s.outcome || '').toLowerCase() === 'straight').length / totalShots) * 100
        )
      : 0
    return { totalShots, averageDistance, bestShot, accuracy }
  }, [shots])

  const handleShotExternal = (shot: Shot) => {
    setShots((prev) => [shot, ...prev].slice(0, 50))
  }

  const playAudio = (audioBase64: string) => {
    try {
      setPlayingAudio(true)
      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`)
      audio.onended = () => setPlayingAudio(false)
      audio.onerror = () => setPlayingAudio(false)
      audio.play()
    } catch (error) {
      console.error('Audio playback error:', error)
      setPlayingAudio(false)
    }
  }

  const fetchPlan = async () => {
    setLoadingPlan(true)
    try {
      const message = "Create a personalized 2-week coaching plan for me based on my recent shots and my skill level/goals."
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          shots: shots.slice(0, 10),
          skill,
          goal
        })
      })
      if (!res.ok) throw new Error('Failed to generate plan')
      const data = await res.json()

      // Parse the response to extract plan structure (this is a simple approach)
      // In a real implementation, you might want the API to return structured data
      const response = data.response
      // For now, just display the response in chat
      const assistantMessage = {
        role: 'assistant' as const,
        content: response,
        timestamp: data.timestamp
      }
      setChatMessages(prev => [...prev, assistantMessage])

      // Keep the old plan format for display, but it's now AI-generated
      // This is a temporary solution; ideally restructure the API
      setPlan({
        days: [], // We'll parse this from the response later
        checkpoints: ['Day 7 check-in', 'Day 14 assessment']
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingPlan(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = { role: 'user' as const, content: currentMessage, timestamp: new Date().toISOString() }
    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setLoadingChat(true)

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          shots: shots.slice(0, 10),
          skill,
          goal
        })
      })

      if (!res.ok) throw new Error('Failed to get response')

      const data = await res.json()
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response,
        timestamp: data.timestamp,
        audio: data.audio
      }
      setChatMessages(prev => [...prev, assistantMessage])
      
      // Auto-play voice response if available
      if (data.audio) {
        playAudio(data.audio)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble right now. Let\'s try again.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setLoadingChat(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Onboarding Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-joe-black/30 border border-joe-gold/20 rounded-2xl p-4">
        <div>
          <label className="block text-sm text-joe-white/70 mb-1">Skill Level</label>
          <select
            value={skill}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSkill(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
            className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg px-3 py-2 text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-joe-white/70 mb-1">Primary Goal</label>
          <select
            value={goal}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGoal(e.target.value as 'distance' | 'accuracy' | 'consistency')}
            className="w-full bg-joe-stone border border-joe-gold/30 rounded-lg px-3 py-2 text-white"
          >
            <option value="consistency">Consistency</option>
            <option value="distance">Distance</option>
            <option value="accuracy">Accuracy</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={fetchPlan} disabled={loadingPlan} className="w-full bg-joe-gold text-joe-black font-semibold rounded-lg px-4 py-2 hover:bg-amber-400 disabled:opacity-60">
            {loadingPlan ? 'Generating…' : 'Update Plan'}
          </button>
        </div>
      </div>
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setDemoEnabled((v) => !v)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-joe-black/50 border border-joe-gold/30 text-joe-gold hover:bg-joe-gold/10 transition"
        >
          <Play className="w-5 h-5" />
          {demoEnabled ? 'Demo Enabled' : 'Enable Demo'}
        </button>
        <button
          onClick={() => setShowCaddie(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-joe-black/50 border border-joe-gold/30 text-joe-gold hover:bg-joe-gold/10 transition"
        >
          <MessageCircle className="w-5 h-5" />
          Open Voice Caddie
        </button>
        <Link
          href="/lessons"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-joe-black/50 border border-joe-gold/30 text-joe-gold hover:bg-joe-gold/10 transition"
        >
          <Calendar className="w-5 h-5" />
          Book a Private Lesson
        </Link>
      </div>

      {/* Embedded Simulator */}
      <div id="start-demo" className="bg-joe-black/30 border border-joe-gold/20 rounded-2xl p-4">
        <GolfSimulatorWithAnalysis disabled={!demoEnabled} onShotTakenExternal={handleShotExternal} />
      </div>

      {/* Swing Capture (webcam) */}
      <div className="bg-joe-black/30 border border-joe-gold/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-joe-gold" />
          <h3 className="text-joe-gold font-joe-heading text-xl">Webcam Swing Capture (Beta)</h3>
        </div>
        <SwingCapture />
      </div>

      {/* Your Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <PerformanceMetrics stats={stats} shots={shots.map(s => ({ distance: s.distance || 0 }))} />
        <ShotHistory
          shots={shots.map((s, i) => ({
            shot_number: shots.length - i,
            outcome: s.outcome || 'straight',
            club_used: s.club || '7i',
            distance: s.distance || 0,
            angle: s.angle || 0,
            force: s.force || 0,
          }))}
          onReplayShot={(i) => console.log('replay', i)}
          onClearHistory={() => setShots([])}
        />
      </div>

      {/* Personalized Plan */}
      <div className="bg-joe-black/30 border border-joe-gold/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-joe-gold" />
            <h3 className="text-joe-gold font-joe-heading text-xl">Your 2‑Week Coaching Plan</h3>
          </div>
          <button
            onClick={fetchPlan}
            disabled={loadingPlan}
            className="px-4 py-2 rounded bg-joe-gold text-joe-black font-semibold hover:bg-amber-400 disabled:opacity-60"
          >
            {loadingPlan ? 'Generating…' : 'Build My Plan'}
          </button>
        </div>
        {plan ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {plan.days.map((d) => (
              <div key={d.day} className="p-3 rounded-lg border border-joe-gold/20 bg-black/30">
                <div className="text-joe-gold font-semibold mb-1">Day {d.day}: {d.focus}</div>
                <ul className="text-sm text-joe-white/80 list-disc ml-5">
                  {d.drills.map((dr, idx) => (<li key={idx}>{dr}</li>))}
                </ul>
                {d.notes && <div className="text-xs text-joe-white/60 mt-2">{d.notes}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-joe-white/70">Generate a tailored plan from your recent swings.</p>
        )}
      </div>

      {/* AI Coach Chat */}
      <div className="bg-joe-black/30 border border-joe-gold/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-joe-gold" />
          <h3 className="text-joe-gold font-joe-heading text-xl">Chat with Uncle Joe</h3>
        </div>
        <div className="space-y-4">
          {/* Chat Messages */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {chatMessages.length === 0 && (
              <p className="text-joe-white/70 text-center py-8">
                Start a conversation with Uncle Joe for personalized coaching advice!
              </p>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-joe-gold text-joe-black'
                    : 'bg-joe-stone text-joe-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                    {msg.role === 'assistant' && msg.audio && (
                      <button
                        onClick={() => playAudio(msg.audio!)}
                        disabled={playingAudio}
                        className="ml-2 p-1 hover:bg-joe-gold/20 rounded transition"
                        title="Play voice response"
                      >
                        <Volume2 className="w-4 h-4 text-joe-gold" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loadingChat && (
              <div className="flex justify-start">
                <div className="bg-joe-stone text-joe-white px-4 py-2 rounded-lg">
                  <p className="text-sm">Uncle Joe is thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Uncle Joe for coaching advice..."
              className="flex-1 bg-joe-stone border border-joe-gold/30 rounded-lg px-3 py-2 text-white placeholder-joe-white/50 focus:outline-none focus:border-joe-gold"
              disabled={loadingChat}
            />
            <button
              onClick={sendMessage}
              disabled={loadingChat || !currentMessage.trim()}
              className="px-4 py-2 rounded bg-joe-gold text-joe-black font-semibold hover:bg-amber-400 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Voice Caddie */}
      {showCaddie && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <ConvaiCaddie isOpen={true} onClose={() => setShowCaddie(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
