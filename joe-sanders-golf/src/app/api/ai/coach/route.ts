import { NextRequest, NextResponse } from 'next/server'

// Minimal, dependency-free AI coach plan generator
// Input: { shots?: Array<{ outcome?: string; distance?: number }> }
// Output: { days: { day: number; focus: string; drills: string[]; notes?: string }[]; checkpoints: string[] }
export async function POST(req: NextRequest) {
  try {
    // Be tolerant of missing or malformed JSON bodies
    let payload: unknown = { shots: [] }
    const text = await req.text()
    if (text) {
      try { payload = JSON.parse(text) } catch {}
    }

    const p = (payload as { shots?: Array<{ outcome?: string; distance?: number }> } | undefined)
    const shots: Array<{ outcome?: string; distance?: number }> = Array.isArray(p?.shots)
      ? p!.shots as Array<{ outcome?: string; distance?: number }>
      : []

    // Compute simple stats
    const avg = shots.length
      ? Math.round(shots.reduce((a, s) => a + (s.distance || 0), 0) / shots.length)
      : 180

    // Determine common miss pattern
    const missCounts: Record<string, number> = {}
    for (const s of shots) {
      const outcome = (s.outcome || 'straight').toLowerCase()
      missCounts[outcome] = (missCounts[outcome] || 0) + 1
    }
    let commonMiss: string = 'straight'
    let max = -1
    for (const [k, v] of Object.entries(missCounts)) {
      if (v > max) { commonMiss = k; max = v }
    }

    const focus = commonMiss === 'slice'
      ? 'Fix the slice'
      : commonMiss === 'hook'
      ? 'Control the hook'
      : 'Consistency and distance'

    const drillsBase = focus.includes('slice')
      ? ['Strengthen grip slightly', 'Outside-in to neutral path drill', 'Alignment stick checkpoint']
      : focus.includes('hook')
      ? ['Weaken grip slightly', 'Neutral to inside path drill', 'Tempo 3:1 metronome']
      : ['Centered strike ladder', 'Tempo 3:1 metronome', 'Distance gapping (7 balls)']

    const days = Array.from({ length: 14 }).map((_, i) => ({
      day: i + 1,
      focus,
      drills: drillsBase,
      notes: i % 3 === 0 ? `Target avg distance ${avg + Math.round(i / 3) * 2} yd` : undefined,
    }))

    return NextResponse.json({ days, checkpoints: ['Day 7 check-in', 'Day 14 assessment'] })
  } catch {
    return NextResponse.json({ error: 'Failed to build plan' }, { status: 500 })
  }
}