# Netlify Deployment Environment Setup

This guide provides environment variables specifically for Netlify deployment of the Uncle Joe's Golf platform.

## Prerequisites

- Netlify account and site connected to your GitHub repository
- All API keys from third-party services (Supabase, Auth0, Stripe, etc.)

## 🚀 Quick Copy-Paste Setup

**Copy and paste all of these environment variables into your Netlify dashboard:**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.auth0.com
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
AUTH0_SECRET=your_auth0_secret_here
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
AUTH0_BASE_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
OPENAI_API_KEY=sk-proj_your_openai_api_key_here
ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key_here
NODE_ENV=production
```

**⚠️ Important Notes:**
- Replace `STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here` with your actual webhook secret from Stripe Dashboard
- Email functionality is disabled (no Resend API key configured)
- All other variables are ready to copy-paste as-is

## Detailed Environment Variables by Category

### Core Variables (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.auth0.com
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
```

### Authentication (Required)
```
AUTH0_SECRET=your_auth0_secret_here
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
AUTH0_BASE_URL=https://your-domain.com
```

### AI Features (Required for Golf Coaching)
```
OPENAI_API_KEY=sk-proj_your_openai_api_key_here
ELEVENLABS_API_KEY=sk_your_elevenlabs_api_key_here
```

### Payments (Required for full functionality)
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=[Your Stripe webhook secret - create in Stripe Dashboard > Webhooks]
```

### Email (Required for contact/newsletter)
```
RESEND_API_KEY=[Your Resend API key - re_...]
```

### Analytics (Optional but recommended)
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=[Your Google Analytics ID]
```

### Error Tracking (Optional)
```
NEXT_PUBLIC_SENTRY_DSN=[Your Sentry DSN]
```

## Build Settings

Ensure these are configured in Netlify:

- **Base directory**: `joe-sanders-golf`
- **Build command**: `STATIC_EXPORT=true npm run build`
- **Publish directory**: `out`
- **Node version**: `20`

## Build Environment Variables

Add these build-time variables:

```
NODE_VERSION=20
NEXT_TELEMETRY_DISABLED=1
STATIC_EXPORT=true
```

## Verification

After setting variables and redeploying:

1. Check the deploy log for any missing environment errors
2. Test authentication flow
3. Verify database connections
4. Test payment processing
5. Check analytics tracking

## Troubleshooting

### Common Issues:
- **401 Errors**: Check Supabase/Auth0 keys are correct
- **Build Failures**: Ensure all required variables are set
- **Auth Redirects**: Verify `AUTH0_BASE_URL` matches your domain

### Debug Steps:
1. Run `npm run config:validate` locally with the same variables
2. Check Netlify deploy logs for specific error messages
3. Verify API keys haven't expired
4. Ensure domain is correctly configured in Auth0/Stripe

## Security

- Environment variables are encrypted at rest in Netlify
- They are only accessible during builds and at runtime
- Never log or expose these values in your code
- Rotate keys regularly through their respective dashboards