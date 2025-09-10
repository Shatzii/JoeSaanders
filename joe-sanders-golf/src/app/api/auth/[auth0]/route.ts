import auth0 from '@/lib/auth0'

export const GET = auth0.handleAuth({
  callback: auth0.handleCallback(),
  login: auth0.handleLogin({
    returnTo: '/admin'
  }),
  logout: auth0.handleLogout({
    returnTo: '/'
  })
})
