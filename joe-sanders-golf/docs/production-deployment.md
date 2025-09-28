# 🚀 Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

1. **Supabase Account & Project**
   - Create a project at [supabase.com](https://supabase.com)
   - Note your project URL and API keys

2. **Auth0 Account & Application**
   - Create an application at [auth0.com](https://auth0.com)
   - Configure callback URLs for your domain

3. **Stripe Account**
   - Create a Stripe account at [stripe.com](https://stripe.com)
   - Set up webhook endpoints for your domain

4. **Resend Account**
   - Create an account at [resend.com](https://resend.com)
   - Verify your domain for email sending

5. **Vercel Account** (for hosting)
   - Create an account at [vercel.com](https://vercel.com)

## Step 1: Database Setup

### Create Supabase Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Merchandise table
CREATE TABLE merchandise (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'apparel',
  in_stock BOOLEAN DEFAULT true,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security (RLS)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public read access for sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read access for merchandise" ON merchandise FOR SELECT USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Admin full access for tournaments" ON tournaments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for sponsors" ON sponsors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for merchandise" ON merchandise FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access for newsletter" ON newsletter_subscribers FOR ALL USING (auth.role() = 'authenticated');
```

### Run Migration Script

After setting up your environment variables, run the migration:

```bash
npm run migrate:supabase
```

## Step 2: Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH0_SECRET`
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Step 3: Auth0 Configuration

1. **Create Auth0 Application:**
   - Go to Auth0 Dashboard → Applications → Create Application
   - Choose "Regular Web Application"
   - Name: "Uncle Joes Golf"

2. **Configure URLs:**
   - **Allowed Callback URLs:** `https://yourdomain.com/api/auth/callback/auth0`
   - **Allowed Logout URLs:** `https://yourdomain.com`
   - **Allowed Web Origins:** `https://yourdomain.com`

3. **Get Credentials:**
   - Copy Domain, Client ID, and Client Secret to your `.env.local`

## Step 4: Stripe Configuration

1. **Create Products in Stripe:**
   - Go to Stripe Dashboard → Products
   - Create products for each merchandise item
   - Note the Price IDs for your `.env.local`

2. **Set up Webhooks:**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`
   - Copy webhook secret to your `.env.local`

## Step 5: Email Configuration

1. **Verify Domain in Resend:**
   - Go to Resend Dashboard → Domains
   - Add your domain (stonesgolf.com)
   - Follow DNS verification steps

2. **Update Environment:**
   - Add your Resend API key to `.env.local`
   - Set `CONTACT_EMAIL` to your verified email

## Step 6: Deploy to Vercel

1. **Connect Repository:**
   - Go to Vercel Dashboard → New Project
   - Import your GitHub repository

2. **Configure Environment Variables:**
   - Add all variables from your `.env.local` to Vercel
   - Set environment to Production

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your site will be live at the generated URL

## Step 7: Domain Configuration

1. **Update Auth0:**
   - Change callback URLs to use your custom domain

2. **Update Stripe:**
   - Update webhook endpoint URL

3. **Update Environment:**
   - Set `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Set `AUTH0_BASE_URL` to your custom domain
   - Set `NEXTAUTH_URL` to your custom domain

## Step 8: Post-Deployment Checks

### Test Core Functionality:
- [ ] Homepage loads correctly
- [ ] Authentication works (login/logout)
- [ ] Admin panel accessible (authenticated users only)
- [ ] Contact form submits successfully
- [ ] Newsletter signup works
- [ ] Shop page displays merchandise
- [ ] Stripe checkout process works

### Test Admin Features:
- [ ] CRUD operations for tournaments
- [ ] CRUD operations for sponsors
- [ ] CRUD operations for merchandise
- [ ] Data migration successful

### Test Monitoring:
- [ ] Sentry error tracking active
- [ ] Health check endpoint responds
- [ ] Logs are being captured

## Step 9: Security Hardening

1. **Enable HTTPS:** (Vercel does this automatically)
2. **Set up Monitoring:** Configure alerts in Sentry
3. **Review Permissions:** Ensure Auth0 roles are properly configured
4. **Backup Strategy:** Set up Supabase backups

## Troubleshooting

### Common Issues:

**Database Connection Issues:**
- Verify Supabase URL and keys are correct
- Check if RLS policies are properly configured

**Authentication Issues:**
- Ensure Auth0 callback URLs match your domain
- Verify environment variables are set correctly

**Payment Issues:**
- Check Stripe webhook secret is correct
- Ensure price IDs match your products

**Email Issues:**
- Verify domain is properly configured in Resend
- Check API key permissions

## Performance Optimization

After deployment, consider:

1. **Image Optimization:** Use Next.js Image component for all images
2. **Bundle Analysis:** Run `npm run build` and analyze bundle size
3. **Caching:** Implement proper caching headers
4. **CDN:** Ensure static assets are served from CDN

## Monitoring & Maintenance

- **Daily:** Check Sentry for new errors
- **Weekly:** Review analytics and performance metrics
- **Monthly:** Update dependencies and security patches
- **Quarterly:** Review and optimize database queries

---

🎉 **Congratulations! Your Uncle Joes Golf website is now live and enterprise-ready!**

For support or questions, refer to the documentation or contact your development team.
