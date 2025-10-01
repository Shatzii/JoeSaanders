'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { Play, Video, MessageCircle, BookOpen, Calendar } from 'lucide-react'
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

  const fetchPlan = async () => {
    setLoadingPlan(true)
    try {
      const res = await fetch('/api/ai/coach', { method: 'POST', body: JSON.stringify({ shots: shots.slice(0, 10) }) })
      if (!res.ok) throw new Error('Failed to generate plan')
      const data: PlanResponse = await res.json()
      setPlan(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingPlan(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
