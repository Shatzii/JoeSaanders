import { NextRequest, NextResponse } from 'next/server'

// This API route must never be statically optimized.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const { auth0: action } = await params

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
      // For now, set an admin cookie and redirect to admin
      const response = NextResponse.redirect('/admin')
      response.cookies.set('role', 'admin', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8 // 8 hours
      })
      response.cookies.set('auth-token', 'stub', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8
      })
      return response

    default:
      return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 })
  }
}
