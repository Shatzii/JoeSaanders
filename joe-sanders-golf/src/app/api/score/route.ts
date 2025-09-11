import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { playerName, score, holeId = 1 } = body

    if (!playerName || score === undefined) {
      return NextResponse.json(
        { error: 'Player name and score are required' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Save score to database
    const { data, error } = await supabase
      .from('scores')
      .insert({
        player_name: playerName,
        score: score,
        hole_id: holeId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving score:', error)
      return NextResponse.json(
        { error: 'Failed to save score' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in score API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const holeId = searchParams.get('holeId') || '1'

    const supabase = createRouteHandlerClient({ cookies })

    // Get leaderboard for specific hole
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('hole_id', holeId)
      .order('score', { ascending: true })
      .limit(parseInt(limit))

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in leaderboard API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}