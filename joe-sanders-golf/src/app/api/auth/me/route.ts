import { NextRequest, NextResponse } from 'next/server'

// Required for static export
export const dynamic = 'force-static'
export const revalidate = false

export async function GET(_request: NextRequest) {
  // For now, return a mock user since we don't have full Auth0 integration
  // In a real implementation, this would validate the session/token
  const mockUser = {
    id: 'user-123',
    name: 'Admin User',
    email: 'admin@unclejoesgolf.com',
  picture: '/images/UnkJoeLogo.png'
  }

  return NextResponse.json({ user: mockUser })
}
