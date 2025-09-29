// Auth0 configuration for Next.js 14
export const auth0Config = {
  secret: process.env.AUTH0_SECRET!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  baseURL: process.env.AUTH0_BASE_URL!,
  clientID: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
}

// Simple auth handler for API routes
export const authHandler = {
  handleAuth: () => ({
    GET: async (req: Request) => {
      // Basic auth handling - redirect to Auth0
      const authUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
        new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID!,
          redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          response_type: 'code',
          scope: 'openid profile email'
        })

      return Response.redirect(authUrl)
    }
  }),

  handleCallback: () => ({
    GET: async (req: Request) => {
      // Handle callback - this would normally exchange code for tokens
      return Response.redirect('/admin')
    }
  }),

  handleLogin: (options: { returnTo?: string }) => ({
    GET: async (req: Request) => {
      const returnTo = options.returnTo || '/'
      const authUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
        new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID!,
          redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          response_type: 'code',
          scope: 'openid profile email',
          state: btoa(JSON.stringify({ returnTo }))
        })

      return Response.redirect(authUrl)
    }
  }),

  handleLogout: (options: { returnTo?: string }) => ({
    GET: async (req: Request) => {
      const returnTo = options.returnTo || '/'
      const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
        new URLSearchParams({
          client_id: process.env.AUTH0_CLIENT_ID!,
          returnTo: `${process.env.AUTH0_BASE_URL}${returnTo}`
        })

      return Response.redirect(logoutUrl)
    }
  })
}

export default authHandler
