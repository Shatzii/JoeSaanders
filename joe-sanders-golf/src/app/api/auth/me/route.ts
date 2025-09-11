import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // For now, return a mock user since we don't have full Auth0 integration
  // In a real implementation, this would validate the session/token
  const mockUser = {
    id: 'user-123',
    name: 'Admin User',
    email: 'admin@unclejoesgolf.com',
    picture: '/UnkJoeLogo.png'
  }

  return NextResponse.json({ user: mockUser })
}
