import { NextResponse } from 'next/server'

// Mock auth routes for development
export const GET = async (request: Request) => {
  const url = new URL(request.url)
  const action = url.pathname.split('/').pop()

  switch (action) {
    case 'login':
      // Redirect to admin in development
      return NextResponse.redirect(new URL('/admin', request.url))
    case 'logout':
      // Redirect to home in development
      return NextResponse.redirect(new URL('/', request.url))
    case 'callback':
      // Redirect to admin after "login" in development
      return NextResponse.redirect(new URL('/admin', request.url))
    default:
      return NextResponse.json({ error: 'Auth not configured' }, { status: 501 })
  }
}
