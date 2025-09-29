<<<<<<< HEAD
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
=======
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { auth0: string } }
) {
  const action = params.auth0

  switch (action) {
    case 'login':
      // Redirect to Auth0 login
      const loginUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
        new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID!,
          redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          response_type: 'code',
          scope: 'openid profile email'
        })

      return NextResponse.redirect(loginUrl)

    case 'logout':
      // Redirect to Auth0 logout
      const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
        new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID!,
          returnTo: `${process.env.AUTH0_BASE_URL}/`
        })

      return NextResponse.redirect(logoutUrl)

    case 'callback':
      // Handle Auth0 callback - this would normally exchange code for tokens
      // For now, just redirect to admin
      return NextResponse.redirect('/admin')

    default:
      return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 })
>>>>>>> origin/copilot/vscode1757631355561
  }
}
