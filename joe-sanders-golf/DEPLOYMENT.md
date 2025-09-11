# 🚀 Uncle Joes Golf - Production Deployment Guide

## Overview
This guide will help you deploy the Uncle Joes Golf website to production, completing the final 5% of enterprise readiness.

## 📋 Prerequisites

- [ ] Domain name (unclejoesgolf.com)
- [ ] Supabase account
- [ ] Auth0 account
- [ ] Stripe account
- [ ] Resend account
- [ ] Google Analytics account
- [ ] Sentry account (optional)
- [ ] Vercel/Netlify account for hosting

## 🔧 Step-by-Step Setup

### 1. Environment Configuration

#### Copy Environment Template
```bash
cp .env.example .env.local
```

#### Fill in Required Values
Edit `.env.local` with your actual production values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# Auth0
AUTH0_SECRET=your_auth0_secret
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_BASE_URL=https://unclejoesgolf.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_FAN_CLUB=price_your_fan_club_price_id
NEXT_PUBLIC_STRIPE_PRICE_MERCH=price_your_merch_price_id

# Email
RESEND_API_KEY=re_your_resend_api_key
CONTACT_EMAIL=contact@unclejoesgolf.com

# Site
NEXT_PUBLIC_SITE_URL=https://unclejoesgolf.com
NEXTAUTH_SECRET=your_secure_random_string
NEXTAUTH_URL=https://unclejoesgolf.com

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

#### Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

#### Get Supabase Keys
1. Go to Project Settings → API
2. Copy the Project URL and anon/public key
3. Copy the service_role key (keep secret!)

### 3. Auth0 Setup

#### Create Auth0 Application
1. Go to [auth0.com](https://auth0.com)
2. Create a new application (Regular Web App)
3. Configure settings:
   - **Name**: Uncle Joes Golf
   - **Application Type**: Regular Web Application
   - **Allowed Callback URLs**: `https://unclejoesgolf.com/api/auth/callback`
   - **Allowed Logout URLs**: `https://unclejoesgolf.com`
   - **Allowed Web Origins**: `https://unclejoesgolf.com`

#### Get Auth0 Credentials
1. Go to Application Settings
2. Copy Domain, Client ID, and Client Secret
3. Generate a secure secret for AUTH0_SECRET

### 4. Stripe Setup

#### Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Create a business account
3. Complete verification process

#### Create Products and Prices
```bash
# Create Fan Club subscription
# Go to Products → Create Product
# Name: Fan Club Membership
# Price: $9.99/month or $99/year

# Create Merchandise product
# Name: Pro Shop Item
# Price: Variable pricing
```

#### Get Stripe Keys
1. Go to Developers → API Keys
2. Copy Publishable key and Secret key
3. Create webhook endpoint for `https://unclejoesgolf.com/api/webhooks/stripe`

### 5. Email Setup (Resend)

#### Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Create account and verify domain
3. Add `unclejoesgolf.com` as verified domain

#### Get API Key
1. Go to API Keys
2. Create a new API key
3. Copy the key for RESEND_API_KEY

### 6. Analytics Setup (Optional)

#### Google Analytics 4
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create GA4 property
3. Copy Measurement ID (G-XXXXXXXXXX)

#### Sentry (Optional)
1. Go to [sentry.io](https://sentry.io)
2. Create Next.js project
3. Copy DSN for error tracking

### 7. Hosting Deployment

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy:vercel
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build:production
npm run deploy:netlify
```

### 8. Domain Configuration

#### Point Domain to Hosting
1. **Vercel**: Add domain in Vercel dashboard
2. **Netlify**: Add domain in Netlify dashboard
3. Update DNS records as instructed

#### SSL Certificate
- Automatic with Vercel/Netlify
- Free SSL certificate included

### 9. Post-Deployment Verification

#### Run Production Validation
```bash
npm run config:validate
```

#### Test Core Features
- [ ] Homepage loads correctly
- [ ] Golf simulator works
- [ ] Authentication flow
- [ ] Payment processing
- [ ] Email sending
- [ ] Admin dashboard
- [ ] Analytics tracking

#### Performance Testing
```bash
# Test Core Web Vitals
npm run build:analyze

# Run security audit
npm run security-audit
```

## 🔒 Security Checklist

- [ ] All environment variables set correctly
- [ ] Database connection secured
- [ ] Authentication properly configured
- [ ] Payment processing secure
- [ ] SSL certificate active
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Error logging configured

## 📊 Monitoring Setup

### Analytics
- Google Analytics 4 configured
- Custom events tracking user interactions
- Conversion tracking for subscriptions

### Error Monitoring
- Sentry configured for error tracking
- Performance monitoring active
- User feedback collection

### Database Monitoring
- Supabase dashboard for database metrics
- Query performance monitoring
- Backup verification

## 🚀 Go-Live Checklist

- [ ] All environment variables configured
- [ ] Database seeded with initial data
- [ ] Authentication working
- [ ] Payment processing tested
- [ ] Email delivery confirmed
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Backup strategy in place
- [ ] Monitoring tools active
- [ ] Team notified of launch

## 📞 Support

If you encounter issues during deployment:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check hosting platform logs
5. Review Supabase/Auth0/Stripe dashboards

## 🎯 Success Metrics

After deployment, monitor:
- Page load times (< 3 seconds)
- Core Web Vitals scores
- User engagement metrics
- Conversion rates
- Error rates (< 1%)

---

**Congratulations!** 🎉 Your Uncle Joes Golf website is now 100% enterprise-ready and production-deployed!
