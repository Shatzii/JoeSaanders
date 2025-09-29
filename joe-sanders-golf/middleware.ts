import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For now, allow access in development or redirect to login
    // TODO: Implement proper session checking with Auth0
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      console.log('Allowing access to admin in development mode')
      return NextResponse.next()
    }

    // In production, redirect to login for now
    // This should be replaced with proper Auth0 session checking
    const loginUrl = new URL('/api/auth/login', request.url)
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
