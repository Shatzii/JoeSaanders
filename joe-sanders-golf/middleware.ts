import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // requests per window

// Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://connect.facebook.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.auth0.com https://*.elevenlabs.io https://*.openai.com;
    frame-src https://js.stripe.com https://connect.facebook.net;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim(),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  userLimit.count++
  return false
}

function validateInput(request: NextRequest): boolean {
  // Basic input validation for common attack vectors
  const url = request.url
  const userAgent = request.headers.get('user-agent') || ''

  // Block suspicious user agents
  const suspiciousAgents = [
    'sqlmap',
    'nmap',
    'masscan',
    'dirbuster',
    'gobuster',
    'nikto',
    'acunetix',
    'openvas'
  ]

  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return false
  }

  // Block common SQL injection patterns in URL
  const sqlInjectionPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i
  ]

  if (sqlInjectionPatterns.some(pattern => pattern.test(url))) {
    return false
  }

  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             request.headers.get('cf-connecting-ip') ||
             'unknown'

  // Rate limiting
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
      }
    })
  }

  // Input validation
  if (!validateInput(request)) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  // Enhanced admin route protection
  if (pathname.startsWith('/admin')) {
    // Require admin role cookie set by Auth0 callback
    const role = request.cookies.get('role')?.value
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // API route protection
  if (pathname.startsWith('/api')) {
    // CORS headers for API routes
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS || 'https://joesandersgolf.com'
        : '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: corsHeaders })
    }

    // Add CORS headers to response
    Object.assign(securityHeaders, corsHeaders)

    // API-specific rate limiting (stricter)
    const apiLimit = rateLimitStore.get(`${ip}-api`) || { count: 0, resetTime: 0 }
    if (Date.now() > apiLimit.resetTime) {
      rateLimitStore.set(`${ip}-api`, { count: 1, resetTime: Date.now() + 30000 }) // 30 seconds for API
    } else if (apiLimit.count > 50) { // 50 requests per 30 seconds for API
      return new NextResponse('API Rate Limit Exceeded', { status: 429 })
    } else {
      apiLimit.count++
    }
  }

  // Create response with security headers
  const response = NextResponse.next()

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add admin-specific header if accessing admin routes
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Admin-Access', 'true')
  }

  // Add additional headers
  response.headers.set('X-Content-Security-Policy', securityHeaders['Content-Security-Policy'])
  response.headers.set('X-WebKit-CSP', securityHeaders['Content-Security-Policy'])

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/simulator/:path*',
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/).*)'
  ]
}