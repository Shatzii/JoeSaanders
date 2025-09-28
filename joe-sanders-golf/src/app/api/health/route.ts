import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import logger from '@/lib/logger'

// Required for static export
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connectivity
    let dbStatus = 'unknown'
    let dbResponseTime = 0

    if (supabase) {
      const dbStartTime = Date.now()
      const { error } = await supabase.from('tournaments').select('count').limit(1).single()
      dbResponseTime = Date.now() - dbStartTime

      if (error) {
        dbStatus = 'error'
        logger.error('Database health check failed', { error: error.message })
      } else {
        dbStatus = 'healthy'
      }
    } else {
      dbStatus = 'not_configured'
    }

    // Check external services
    const services = {
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        timestamp: new Date().toISOString()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasSupabase: !!supabase,
        hasStripe: !!process.env.STRIPE_SECRET_KEY,
        hasResend: !!process.env.RESEND_API_KEY,
        hasAuth0: !!process.env.AUTH0_CLIENT_ID
      }
    }

    const totalResponseTime = Date.now() - startTime
    const overallStatus = dbStatus === 'healthy' ? 'healthy' : 'degraded'

    logger.info('Health check completed', {
      status: overallStatus,
      responseTime: totalResponseTime,
      services
    })

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: totalResponseTime,
      services,
      version: process.env.npm_package_version || '1.0.0'
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Health check failed', { error: errorMessage })

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: errorMessage,
      services: {
        database: { status: 'error' },
        environment: { status: 'error' }
      }
    }, { status: 503 })
  }
}
