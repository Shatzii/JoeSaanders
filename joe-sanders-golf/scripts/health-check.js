#!/usr/bin/env node

/**
 * Production Health Check Script
 * Validates all critical services are working before deployment
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const https = require('https')
const { execSync } = require('child_process')

console.log('🔍 Running Production Health Check...\n')

const checks = [
  {
    name: 'Environment Variables',
    check: () => {
      const required = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'AUTH0_SECRET',
        'AUTH0_ISSUER_BASE_URL',
        'AUTH0_CLIENT_ID',
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'RESEND_API_KEY',
        'NEXT_PUBLIC_SITE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL'
      ]

      const missing = required.filter(key => !process.env[key])
      if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`)
      }
      return '✅ All required environment variables are set'
    }
  },
  {
    name: 'Supabase Connection',
    check: async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!url) throw new Error('Supabase URL not configured')

      return new Promise((resolve, reject) => {
        https.get(`${url}/rest/v1/`, (res) => {
          if (res.statusCode === 200 || res.statusCode === 401) {
            resolve('✅ Supabase connection successful')
          } else {
            reject(new Error(`Supabase returned status ${res.statusCode}`))
          }
        }).on('error', reject)
      })
    }
  },
  {
    name: 'Auth0 Configuration',
    check: async () => {
      const domain = process.env.AUTH0_ISSUER_BASE_URL
      if (!domain) throw new Error('Auth0 domain not configured')

      return new Promise((resolve, reject) => {
        https.get(`${domain}/.well-known/openid-configuration`, (res) => {
          if (res.statusCode === 200) {
            resolve('✅ Auth0 configuration valid')
          } else {
            reject(new Error(`Auth0 returned status ${res.statusCode}`))
          }
        }).on('error', reject)
      })
    }
  },
  {
    name: 'Stripe Configuration',
    check: () => {
      const key = process.env.STRIPE_SECRET_KEY
      if (!key) throw new Error('Stripe secret key not configured')

      if (!key.startsWith('sk_live_') && !key.startsWith('sk_test_')) {
        throw new Error('Invalid Stripe secret key format')
      }

      return '✅ Stripe configuration valid'
    }
  },
  {
    name: 'Resend Configuration',
    check: () => {
      const key = process.env.RESEND_API_KEY
      if (!key) throw new Error('Resend API key not configured')

      if (!key.startsWith('re_')) {
        throw new Error('Invalid Resend API key format')
      }

      return '✅ Resend configuration valid'
    }
  },
  {
    name: 'TypeScript Compilation',
    check: () => {
      try {
        execSync('npm run type-check', { stdio: 'pipe' })
        return '✅ TypeScript compilation successful'
      } catch (error) {
        throw new Error('TypeScript compilation failed')
      }
    }
  },
  {
    name: 'Build Process',
    check: () => {
      try {
        const cmd = process.env.NETLIFY === 'true' || process.env.STATIC_EXPORT === 'true'
          ? 'npm run build:static'
          : 'npm run build'
        execSync(cmd, { stdio: 'pipe' })
        return '✅ Production build successful'
      } catch {
        throw new Error('Production build failed')
      }
    }
  },
  {
    name: 'Security Audit',
    check: () => {
      try {
        execSync('npm run security-audit', { stdio: 'pipe' })
        return '✅ Security audit passed'
      } catch {
        console.warn('⚠️  Security vulnerabilities found - review npm audit output')
        return '⚠️  Security audit completed with warnings'
      }
    }
  }
]

async function runHealthCheck() {
  let passed = 0
  let failed = 0

  for (const { name, check } of checks) {
    process.stdout.write(`Checking ${name}... `)

    try {
      const result = await check()
      console.log(result)
      passed++
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`Health Check Results: ${passed} passed, ${failed} failed`)

  if (failed === 0) {
    console.log('🎉 All checks passed! Ready for production deployment.')
    process.exit(0)
  } else {
    console.log('⚠️  Some checks failed. Please resolve issues before deployment.')
    process.exit(1)
  }
}

runHealthCheck().catch(error => {
  console.error('Health check failed:', error)
  process.exit(1)
})
