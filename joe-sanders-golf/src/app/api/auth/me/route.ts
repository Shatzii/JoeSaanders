import { NextRequest, NextResponse } from 'next/server'
import auth0 from '@/lib/auth0'

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ user: session.user })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
