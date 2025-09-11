import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // For now, allow access to admin routes without authentication
  // In a production setup, this would validate JWT tokens or sessions

  // Add any other middleware logic here (logging, rate limiting, etc.)

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}