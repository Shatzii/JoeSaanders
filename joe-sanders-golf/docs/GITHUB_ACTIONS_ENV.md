# GitHub Actions CI Environment Setup

This guide covers setting up repository secrets for GitHub Actions CI/CD pipelines.

## Repository Secrets Setup

In your GitHub repository:

1. Go to **Settings > Secrets and variables > Actions**
2. Click **New repository secret**
3. Add each secret with its exact name and value

## Required Secrets

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL = https://rblvnbzwriqosoboasow.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibHZuYnp3cmlxb3NvYm9hc293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDAwNjUsImV4cCI6MjA3MzY3NjA2NX0.aMvfBdbESVsbWv2qUmLRArovuYoKqMGgnzMaMG8C4A0
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibHZuYnp3cmlxb3NvYm9hc293Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEwMDA2NSwiZXhwIjoyMDczNjc2MDY1fQ.7NQdhS63s6K9EKI1WDwGUz7IH1tN5eRAjxdNpoMuNzg
```

### Auth0
```
AUTH0_SECRET = [Your Auth0 app secret]
AUTH0_ISSUER_BASE_URL = https://dev-hi54vhznvyubj5yv.us.auth0.com
AUTH0_CLIENT_ID = [Your Auth0 client ID]
AUTH0_CLIENT_SECRET = [Your Auth0 client secret]
AUTH0_BASE_URL = https://unclejoesgolf.com
```

### Stripe
```
STRIPE_SECRET_KEY = [Your Stripe secret key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [Your Stripe publishable key]
STRIPE_WEBHOOK_SECRET = [Your Stripe webhook secret]
```

### Resend
```
RESEND_API_KEY = [Your Resend API key]
```

### NextAuth
```
NEXTAUTH_SECRET = zbDHyr6I/y033YowI5AayiWp+tFmLiSFrHWiLngdLkp6lUvlNfLXqNo0g0MVcv1NMm5CIsy1iOfOMWzd5E/7pg==
NEXTAUTH_URL = https://unclejoesgolf.com
```

### Site Configuration
```
NEXT_PUBLIC_SITE_URL = https://unclejoesgolf.com
```

### Optional Analytics
```
NEXT_PUBLIC_GA_MEASUREMENT_ID = [Your Google Analytics ID]
```

### Optional Error Tracking
```
NEXT_PUBLIC_SENTRY_DSN = [Your Sentry DSN]
```

## CI Workflow Usage

The CI workflow (`.github/workflows/ci.yml`) will automatically use these secrets:

- **Env Validation Step**: Tests Supabase and Auth0 connections
- **Build Step**: Uses secrets for production build
- **Fallbacks**: GA uses dummy value if secret not set

## Security Best Practices

- Secrets are encrypted and only accessible to GitHub Actions
- They are not visible in workflow logs
- Rotate secrets regularly
- Use different secrets for different environments if needed
- Never commit secrets to code

## Testing Secrets

To verify secrets are working:

1. Push a commit to trigger CI
2. Check the **Actions** tab for the workflow run
3. Look for:
   - ✅ Environment validation passing
   - ✅ Build completing successfully
   - No exposed secret values in logs

## Updating Secrets

When you need to update a secret:

1. Go to repository **Settings > Secrets and variables > Actions**
2. Click on the secret name
3. Update the value
4. Save changes
5. Trigger a new CI run to test

Note: Updating secrets requires a new commit/push to take effect in workflows.