# 🌐 **STONESGOLF.COM Deployment Guide**
## **Complete Setup Instructions for Domain Migration**

*Step-by-step guide for deploying Uncle Joe's Golf platform to stonesgolf.com*

---

## 🎯 **DEPLOYMENT OVERVIEW**

This guide will walk you through deploying the complete Uncle Joe's Golf platform to the stonesgolf.com domain. The platform is **100% production-ready** with all enterprise features functional.

### **What You'll Deploy:**
- ✅ **AI Golf Simulator** with Uncle Joe's voice coaching
- ✅ **Fan Club Membership System** with subscription billing
- ✅ **E-Commerce Platform** for merchandise sales
- ✅ **Tournament Tracking** with real-time updates
- ✅ **Sponsorship Portal** with lead management
- ✅ **Admin Panel** for content management
- ✅ **Enterprise Security** with Auth0 and monitoring

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **Required Accounts & Services:**
- [ ] **Domain Control**: Access to stonesgolf.com DNS settings
- [ ] **Hosting Platform**: Vercel account (recommended) or alternatives
- [ ] **Database**: Supabase account and project
- [ ] **Authentication**: Auth0 account and application
- [ ] **Payments**: Stripe account for subscriptions/sales
- [ ] **Email**: Resend account for transactional emails
- [ ] **Monitoring**: Sentry account for error tracking
- [ ] **AI Services**: OpenAI and ElevenLabs accounts (optional but recommended)

---

## 🚀 **STEP 1: DOMAIN & DNS SETUP**

### **1.1 Configure DNS Settings**
Point your stonesgolf.com domain to your hosting platform:

```dns
# For Vercel (recommended):
CNAME: www.stonesgolf.com → cname.vercel-dns.com
A: stonesgolf.com → 76.76.19.61

# Alternative for Netlify:
CNAME: www.stonesgolf.com → stupefied-swirles-123456.netlify.app
A: stonesgolf.com → 104.198.14.52
```

### **1.2 SSL Certificate**
Most hosting platforms (Vercel, Netlify) provide automatic SSL certificates. Verify HTTPS is enabled for stonesgolf.com.

### **1.3 Email Setup (Optional but Recommended)**
Configure professional email addresses:
- admin@stonesgolf.com
- contact@stonesgolf.com  
- support@stonesgolf.com

---

## 🗄️ **STEP 2: DATABASE SETUP (SUPABASE)**

### **2.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a strong password for your database
3. Select the region closest to your users
4. Wait for project initialization (2-3 minutes)

### **2.2 Run Database Schema**
In your Supabase SQL Editor, execute this schema:

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
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  monthly_amount DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  description TEXT,
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
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fan club members table
CREATE TABLE fan_club_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI coaching sessions table
CREATE TABLE coaching_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_type TEXT NOT NULL,
  metrics JSONB,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Public tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Public sponsors" ON sponsors FOR SELECT USING (true);  
CREATE POLICY "Public merchandise" ON merchandise FOR SELECT USING (true);
```

### **2.3 Get Database Credentials**
In your Supabase project settings, note these values:
- **Project URL**: `https://yourproject.supabase.co`
- **Public API Key**: `eyJhbG...` (anon key)
- **Service Role Key**: `eyJhbG...` (service_role key - keep secret!)

---

## 🔐 **STEP 3: AUTHENTICATION SETUP (AUTH0)**

### **3.1 Create Auth0 Application**
1. Go to [auth0.com](https://auth0.com) and create account
2. Create new application: "Uncle Joe's Golf"
3. Choose "Regular Web Application"
4. Note your Domain, Client ID, and Client Secret

### **3.2 Configure Auth0 URLs**
In your Auth0 application settings:

```
Allowed Callback URLs:
https://stonesgolf.com/api/auth/callback/auth0
https://www.stonesgolf.com/api/auth/callback/auth0

Allowed Logout URLs:  
https://stonesgolf.com
https://www.stonesgolf.com

Allowed Web Origins:
https://stonesgolf.com
https://www.stonesgolf.com
```

### **3.3 Enable Social Logins (Optional)**
Configure Google, Facebook, or other social providers in Auth0 for easier user registration.

---

## 💳 **STEP 4: PAYMENT SETUP (STRIPE)**

### **4.1 Create Stripe Account**
1. Go to [stripe.com](https://stripe.com) and create account
2. Complete business verification for live payments
3. Note your **Public Key** and **Secret Key**

### **4.2 Create Products in Stripe**
Set up these subscription products:

```
Fan Club Tiers:
- Bronze: $9.99/month
- Silver: $19.99/month  
- Gold: $49.99/month
- Platinum: $99.99/month

Merchandise (examples):
- Uncle Joe Hat: $24.99
- Golf Polo: $49.99
- Golf Gloves: $19.99
```

Note the **Price IDs** for each product (price_xxxxx).

### **4.3 Configure Webhooks**
Add webhook endpoint in Stripe dashboard:
- **URL**: `https://stonesgolf.com/api/webhooks/stripe`
- **Events**: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`
- Note the **Webhook Secret**

---

## 📧 **STEP 5: EMAIL SETUP (RESEND)**

### **5.1 Create Resend Account**
1. Go to [resend.com](https://resend.com) and create account
2. Verify your domain (stonesgolf.com)
3. Add DNS records as instructed by Resend
4. Get your **API Key**

### **5.2 Domain Verification**
Add these DNS records to stonesgolf.com:

```dns
# Resend verification (example - use your actual values)
TXT: _resend.stonesgolf.com → "resend-verification=abc123"
CNAME: resend._domainkey.stonesgolf.com → resend.s1._domainkey.resend.dev
```

---

## 🚀 **STEP 6: DEPLOY TO HOSTING PLATFORM**

### **6.1 Recommended: Vercel Deployment**

#### **A. Connect GitHub Repository**
1. Go to [vercel.com](https://vercel.com) and connect your GitHub account
2. Import the `joe-sanders-golf` repository
3. Choose "Next.js" framework preset

#### **B. Configure Environment Variables**
In Vercel project settings, add these environment variables:

```env
# Domain Configuration
NEXT_PUBLIC_SITE_URL=https://stonesgolf.com
NEXTAUTH_URL=https://stonesgolf.com

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Auth0 Authentication  
AUTH0_SECRET=your-32-character-secret-key
AUTH0_BASE_URL=https://stonesgolf.com
AUTH0_ISSUER_BASE_URL=https://yourtenent.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Service
RESEND_API_KEY=re_...
CONTACT_EMAIL=contact@stonesgolf.com

# AI Services (Optional but Recommended)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=sk_...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900
```

#### **C. Deploy**
1. Commit any final changes to your repository
2. Vercel will automatically build and deploy
3. Check build logs for any errors
4. Your site will be live at the Vercel URL

### **6.2 Configure Custom Domain**
1. In Vercel project settings, go to "Domains"
2. Add "stonesgolf.com" and "www.stonesgolf.com"
3. Follow DNS configuration instructions
4. Wait for SSL certificate generation (automatic)

---

## ✅ **STEP 7: POST-DEPLOYMENT VERIFICATION**

### **7.1 Test Core Features**
Visit your live site and verify:

- [ ] **Homepage** loads correctly at `https://stonesgolf.com`
- [ ] **AI Simulator** works at `/simulator`
- [ ] **User Registration** works with Auth0
- [ ] **Fan Club Signup** processes payments
- [ ] **Shop** accepts merchandise orders
- [ ] **Contact Form** sends emails
- [ ] **Admin Panel** allows content management

### **7.2 Test Payment Flow**
1. **Subscribe to Fan Club**: Complete signup process with test credit card
2. **Purchase Merchandise**: Buy item from shop and verify order
3. **Check Stripe Dashboard**: Confirm payments are being processed
4. **Test Webhooks**: Verify Stripe webhooks are received

### **7.3 Verify Email Delivery**
1. **Contact Form**: Submit message and verify email receipt
2. **Newsletter Signup**: Subscribe and verify welcome email
3. **Order Confirmations**: Check purchase confirmation emails

### **7.4 Test AI Features**
1. **Golf Simulator**: Play a game and get AI coaching
2. **Voice Caddie**: Test ElevenLabs voice synthesis
3. **Progress Tracking**: Verify session data is saved

---

## 🔧 **STEP 8: PRODUCTION OPTIMIZATION**

### **8.1 Performance Configuration**
```env
# Add to environment variables for production optimization
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
ENABLE_ANALYTICS=true
ENABLE_SENTRY=true
```

### **8.2 SEO Setup**
1. **Google Search Console**: Add and verify stonesgolf.com
2. **Google Analytics**: Add tracking code (GA4 recommended)
3. **Meta Tags**: Verify all pages have proper meta descriptions
4. **Sitemap**: Submit sitemap.xml to search engines

### **8.3 Monitoring Setup**
1. **Sentry**: Configure error alerting and monitoring
2. **Uptime Monitoring**: Set up availability alerts
3. **Performance Monitoring**: Track Core Web Vitals
4. **Security Monitoring**: Enable breach detection

---

## 📊 **STEP 9: ANALYTICS & TRACKING**

### **9.1 Google Analytics 4**
Add tracking to measure:
- Page views and user sessions
- Conversion funnel (signup → fan club → purchase)
- AI simulator usage metrics
- Tournament page engagement

### **9.2 Business Metrics Dashboard**
Monitor these KPIs:
- **Revenue**: Monthly recurring revenue from subscriptions
- **Users**: New registrations and active users
- **Engagement**: Simulator sessions and AI interactions
- **Conversion**: Visitor to customer conversion rates

### **9.3 Social Media Tracking**
Set up tracking for:
- **Share buttons**: Social media engagement
- **Referral traffic**: Social media → website conversions  
- **Hashtag performance**: #UncleJoesGolf campaign metrics
- **Influencer partnerships**: Affiliate link tracking

---

## 🛡️ **STEP 10: SECURITY & COMPLIANCE**

### **10.1 Security Headers**
Verify these security features are enabled:
- **HTTPS Everywhere**: All traffic redirected to HTTPS
- **Content Security Policy**: XSS protection enabled
- **Rate Limiting**: API abuse prevention active
- **Authentication**: Auth0 security best practices

### **10.2 GDPR Compliance**
Ensure compliance features are active:
- **Cookie Consent**: Banner displays for EU users
- **Privacy Policy**: Complete policy page accessible
- **Data Deletion**: User data deletion requests handled
- **Consent Management**: User preferences respected

### **10.3 Backup Strategy**
Set up automated backups:
- **Database**: Daily Supabase backups
- **Media Files**: CDN backup strategy
- **Code Repository**: GitHub as source backup
- **Configuration**: Environment variables documented

---

## 🚨 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions:**

#### **Build Failures:**
```bash
# Clear cache and rebuild
npm run build:clean
npm install
npm run build
```

#### **Database Connection Issues:**
- Verify Supabase URL and keys are correct
- Check Row Level Security (RLS) policies
- Ensure network access is allowed

#### **Authentication Problems:**
- Verify Auth0 callback URLs match exactly
- Check domain configuration in Auth0
- Ensure AUTH0_SECRET is 32+ characters

#### **Payment Issues:**
- Verify Stripe keys (test vs live mode)
- Check webhook endpoint URL is correct
- Ensure webhook secret matches

#### **Email Delivery Problems:**
- Verify Resend domain is verified
- Check DNS records are properly configured
- Ensure API key has correct permissions

---

## 📞 **SUPPORT & MAINTENANCE**

### **Daily Monitoring:**
- [ ] Check Sentry for new errors
- [ ] Monitor user registration and subscription metrics
- [ ] Review payment processing status
- [ ] Verify AI services are responding correctly

### **Weekly Tasks:**
- [ ] Analyze traffic and conversion metrics
- [ ] Review and respond to contact form messages
- [ ] Update tournament information and content
- [ ] Check for security updates and patches

### **Monthly Reviews:**
- [ ] Performance optimization review
- [ ] Security audit and vulnerability scanning
- [ ] Backup verification and recovery testing
- [ ] Content strategy and SEO analysis

---

## 📈 **GROWTH & SCALING**

### **Traffic Scaling:**
The platform is built to handle growth:
- **Vercel**: Automatic scaling with global CDN
- **Supabase**: Scales to millions of users
- **Stripe**: Enterprise payment processing
- **Auth0**: Unlimited user authentication

### **Feature Expansion:**
Ready for future enhancements:
- **Mobile Apps**: React Native development ready
- **API Integration**: RESTful APIs for third-party services
- **White-label Solutions**: Multi-tenant architecture support
- **International**: Localization and multi-currency support

---

## 🎯 **POST-LAUNCH MARKETING CHECKLIST**

### **Week 1 - Soft Launch:**
- [ ] **Test All Features**: Comprehensive platform testing
- [ ] **Invite Beta Users**: Limited user group for feedback
- [ ] **Content Population**: Add tournaments, sponsors, merchandise
- [ ] **Social Media Setup**: Create and optimize social profiles

### **Week 2 - Content Marketing:**
- [ ] **Blog Launch**: Begin golf tips and Uncle Joe story content
- [ ] **Video Content**: Upload simulator demos and tutorials
- [ ] **Email Campaign**: Launch newsletter signup campaign
- [ ] **SEO Optimization**: Submit to search engines and directories

### **Week 3 - Public Launch:**
- [ ] **Press Release**: Announce platform launch to golf media
- [ ] **Influencer Outreach**: Partner with golf YouTubers and bloggers
- [ ] **Social Campaign**: Launch #UncleJoesGolf hashtag campaign
- [ ] **Community Building**: Begin fan club membership drive

### **Week 4 - Growth & Optimization:**
- [ ] **Analytics Review**: Analyze user behavior and conversion data
- [ ] **Performance Optimization**: Improve based on real user feedback
- [ ] **Partnership Development**: Reach out to potential sponsors
- [ ] **Feature Iteration**: Plan next feature releases based on usage

---

<div align="center">

## 🏌️‍♂️ **STONESGOLF.COM IS READY TO LAUNCH!**

### **Complete Platform Deployment Checklist ✅**

Your Uncle Joe's Golf platform is now fully deployed to stonesgolf.com with:

- ✅ **Professional Domain**: stonesgolf.com with SSL certificate
- ✅ **Enterprise Database**: Supabase with complete schema
- ✅ **Secure Authentication**: Auth0 with user management
- ✅ **Payment Processing**: Stripe with subscriptions and merchandise
- ✅ **Email System**: Resend with domain verification
- ✅ **AI Integration**: OpenAI and ElevenLabs with coaching features
- ✅ **Monitoring**: Sentry with error tracking and alerts
- ✅ **Performance**: Optimized for speed and user experience

### **Ready for Marketing Campaign Launch! 🚀**

The platform can handle viral traffic and is ready for immediate marketing campaigns.

---

**Questions or Need Support?**
Refer to the troubleshooting section or contact your development team.

**Happy Launching! 🎯**

</div>

---

*Deployment Guide Version: 1.0*  
*Created: December 16, 2024*  
*Status: Production Ready ✅*