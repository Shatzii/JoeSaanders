# Environment Variables Setup

This document outlines all required environment variables for the Uncle Joe's Golf platform. Set these in your local `.env.local` file for development, and in your deployment platform (Netlify/GitHub Actions) for production.

## Quick Setup

1. Copy `.env.example` to `.env.local` for local development.
2. Fill in the values below with your actual API keys.
3. For production, set these as environment variables in your deployment platform.

## Required Environment Variables

### Supabase Configuration
Database and authentication backend.

- `NEXT_PUBLIC_SUPABASE_URL`: `https://rblvnbzwriqosoboasow.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibHZuYnp3cmlxb3NvYm9hc293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDAwNjUsImV4cCI6MjA3MzY3NjA2NX0.aMvfBdbESVsbWv2qUmLRArovuYoKqMGgnzMaMG8C4A0`
- `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibHZuYnp3cmlxb3NvYm9hc293Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEwMDA2NSwiZXhwIjoyMDczNjc2MDY1fQ.7NQdhS63s6K9EKI1WDwGUz7IH1tN5eRAjxdNpoMuNzg`

### Auth0 Configuration
User authentication and authorization.

- `AUTH0_SECRET`: Your Auth0 application secret
- `AUTH0_ISSUER_BASE_URL`: `https://dev-hi54vhznvyubj5yv.us.auth0.com`
- `AUTH0_BASE_URL`: `https://unclejoesgolf.com`
- `AUTH0_CLIENT_ID`: Your Auth0 client ID
- `AUTH0_CLIENT_SECRET`: Your Auth0 client secret

### Stripe Configuration
Payment processing.

- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_live_` or `sk_test_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (starts with `pk_live_` or `pk_test_`)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (for webhook verification)

### Resend Configuration
Email sending service.

- `RESEND_API_KEY`: Your Resend API key (starts with `re_`)

### Site Configuration
General site settings.

- `NEXT_PUBLIC_SITE_URL`: `https://unclejoesgolf.com`
- `NEXT_PUBLIC_SITE_NAME`: "Uncle Joes Golf"
- `NEXT_PUBLIC_SITE_DESCRIPTION`: Site description for SEO

### Security & Authentication
NextAuth.js configuration.

- `NEXTAUTH_SECRET`: `zbDHyr6I/y033YowI5AayiWp+tFmLiSFrHWiLngdLkp6lUvlNfLXqNo0g0MVcv1NMm5CIsy1iOfOMWzd5E/7pg==`
- `NEXTAUTH_URL`: `https://unclejoesgolf.com`

### Google Analytics (Optional)
Web analytics tracking.

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Your Google Analytics measurement ID (e.g., `G-XXXXXXXXXX`)

### Sentry Error Tracking (Optional)
Error monitoring and reporting.

- `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN URL

### Development Mode
- `NODE_ENV`: `production` for production builds

## Platform-Specific Setup

### Local Development (.env.local)
Create a `.env.local` file in the project root with all variables listed above.

### Netlify Deployment
In your Netlify site dashboard:
1. Go to **Site Settings > Environment Variables**
2. Add each variable with its value
3. Ensure `NODE_VERSION` is set to `20`

### GitHub Actions (CI/CD)
In your repository settings:
1. Go to **Secrets and variables > Actions**
2. Add repository secrets for each variable (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. The CI workflow will use these automatically

## Validation

Run the health check to verify all variables are set correctly:

```bash
npm run config:validate
```

This will check:
- All required variables are present
- Supabase connection works
- Auth0 configuration is valid
- Stripe keys are properly formatted
- Resend API key is valid
- TypeScript compiles
- Production build succeeds
- Security audit passes

## Security Notes

- Never commit `.env.local` or any file containing real API keys to version control.
- Use different keys for development and production.
- Rotate keys regularly and update immediately if compromised.
- The service role key has elevated permissions - keep it secure.

## Getting API Keys

- **Supabase**: Dashboard > Project Settings > API
- **Auth0**: Dashboard > Applications > Your App > Settings
- **Stripe**: Dashboard > Developers > API Keys
- **Resend**: Dashboard > API Keys
- **Google Analytics**: Admin > Property > Data Streams > Measurement ID
- **Sentry**: Projects > Your Project > Client Keys (DSN)