import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.NODE_ENV || 'development'

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 0.0,
    // Performance monitoring
    tracesSampler: (samplingContext: any) => {
      // Skip health check endpoints
      if (samplingContext.request?.url?.includes('/api/health')) {
        return 0.0
      }
      // Sample 10% of transactions in production
      return SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0
    },
    // Error filtering
    beforeSend: (event: any, hint: any) => {
      // Filter out common non-errors
      if (event.exception) {
        const error = hint.originalException
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as Error).message
          // Filter out network errors that are expected
          if (message.includes('Network request failed') && message.includes('CORS')) {
            return null
          }
        }
      }
      return event
    },
  })
}

export default Sentry
