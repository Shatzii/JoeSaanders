import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import auth0 from '@/lib/auth0'

export async function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip auth check in development if auth is not configured
    if (!auth0) {
      console.log('Auth not configured, allowing access to admin (development mode)')
      return NextResponse.next()
    }

    try {
      const session = await auth0.getSession(request)
      if (!session?.user) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/api/auth/login', request.url)
        loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // Redirect to login on auth error
      const loginUrl = new URL('/api/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
