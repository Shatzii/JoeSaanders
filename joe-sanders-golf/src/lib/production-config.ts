// Production configuration with environment variable validation
// This file ensures all required environment variables are present for production

interface EnvConfig {
  // Supabase
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey: string
  }

  // Auth0
  auth0: {
    secret: string
    issuerBaseURL: string
    baseURL: string
    clientID: string
    clientSecret: string
  }

  // Stripe
  stripe: {
    secretKey: string
    publishableKey: string
    webhookSecret: string
    priceIds: {
      fanClub: string
      merch: string
    }
  }

  // Email
  email: {
    resendApiKey: string
    contactEmail: string
    adminEmail: string
    newsletterFrom: string
  }

  // Analytics
  analytics: {
    gaMeasurementId: string
  }

  // Site
  site: {
    url: string
    name: string
    description: string
  }

  // Security
  security: {
    nextAuthSecret: string
    nextAuthUrl: string
  }
}

function getRequiredEnvVar(name: string, description: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Description: ${description}\n` +
      `Please check your .env.local file and ensure all required variables are set.`
    )
  }
  return value
}

function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue
}

export const config: EnvConfig = {
  supabase: {
    url: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'Supabase project URL'),
    anonKey: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Supabase anonymous key'),
    serviceRoleKey: getRequiredEnvVar('SUPABASE_SERVICE_ROLE_KEY', 'Supabase service role key')
  },

  auth0: {
    secret: getRequiredEnvVar('AUTH0_SECRET', 'Auth0 application secret'),
    issuerBaseURL: getRequiredEnvVar('AUTH0_ISSUER_BASE_URL', 'Auth0 domain URL'),
    baseURL: getRequiredEnvVar('AUTH0_BASE_URL', 'Your application base URL'),
    clientID: getRequiredEnvVar('AUTH0_CLIENT_ID', 'Auth0 application client ID'),
    clientSecret: getRequiredEnvVar('AUTH0_CLIENT_SECRET', 'Auth0 application client secret')
  },

  stripe: {
    secretKey: getRequiredEnvVar('STRIPE_SECRET_KEY', 'Stripe secret key'),
    publishableKey: getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'Stripe publishable key'),
    webhookSecret: getRequiredEnvVar('STRIPE_WEBHOOK_SECRET', 'Stripe webhook secret'),
    priceIds: {
      fanClub: getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PRICE_FAN_CLUB', 'Stripe fan club price ID'),
      merch: getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PRICE_MERCH', 'Stripe merchandise price ID')
    }
  },

  email: {
    resendApiKey: getRequiredEnvVar('RESEND_API_KEY', 'Resend API key for email delivery'),
    contactEmail: getRequiredEnvVar('CONTACT_EMAIL', 'Contact email address'),
    adminEmail: getOptionalEnvVar('ADMIN_EMAIL', 'admin@unclejoesgolf.com'),
    newsletterFrom: getOptionalEnvVar('NEWSLETTER_FROM', 'noreply@unclejoesgolf.com')
  },

  analytics: {
    gaMeasurementId: getOptionalEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID', '')
  },

  site: {
    url: getRequiredEnvVar('NEXT_PUBLIC_SITE_URL', 'Your site URL'),
    name: getOptionalEnvVar('NEXT_PUBLIC_SITE_NAME', 'Uncle Joes Golf'),
    description: getOptionalEnvVar('NEXT_PUBLIC_SITE_DESCRIPTION',
      'Experience the raw athleticism and spiritual symbolism of Uncle Joe Sanders.')
  },

  security: {
    nextAuthSecret: getRequiredEnvVar('NEXTAUTH_SECRET', 'NextAuth secret for session encryption'),
    nextAuthUrl: getRequiredEnvVar('NEXTAUTH_URL', 'NextAuth URL for authentication')
  }
}

// Validate configuration on startup
export function validateConfig(): void {
  try {
    // Test that all required values are present
    const testConfig = { ...config }

    // Additional validation for URLs
    const urlPattern = /^https?:\/\/.+$/
    if (!urlPattern.test(config.site.url)) {
      throw new Error(`Invalid site URL: ${config.site.url}. Must be a valid HTTP/HTTPS URL.`)
    }

    if (!urlPattern.test(config.supabase.url)) {
      throw new Error(`Invalid Supabase URL: ${config.supabase.url}. Must be a valid HTTPS URL.`)
    }

    console.log('✅ Production configuration validated successfully')
  } catch (error) {
    console.error('❌ Production configuration validation failed:')
    console.error(error)
    process.exit(1)
  }
}

// Export individual configs for convenience
export const {
  supabase,
  auth0,
  stripe,
  email,
  analytics,
  site,
  security
} = config

// Development mode check
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = !isProduction
