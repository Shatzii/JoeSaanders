# 🚀 Joe Sanders Golf - Netlify Deployment Guide

## Complete Step-by-Step Deployment to Netlify

This guide will help you deploy the Joe Sanders Golf platform to Netlify with full functionality including the AI Golf Tutor.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ GitHub account with your repository
- ✅ Netlify account (free tier available)
- ✅ OpenAI API key (for AI Golf Tutor)
- ✅ ElevenLabs API key (optional, for voice features)
- ✅ Supabase project (optional, for data storage)

---

## 🎯 Step 1: Prepare Your Repository

### 1.1 Verify Your Code is Ready
```bash
# Navigate to your project
cd /workspaces/JoeSaanders/joe-sanders-golf

# Ensure all changes are committed
git status
git add .
git commit -m "Prepare for Netlify deployment"
git push origin copilot/vscode1758026245338
```

### 1.2 Create Netlify Configuration
Create a `netlify.toml` file in your project root:

```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = ".netlify/functions"

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🌐 Step 2: Deploy to Netlify

### 2.1 Connect Your Repository

1. **Visit Netlify**: Go to [netlify.com](https://netlify.com)
2. **Sign Up/Login**: Use your GitHub account for easy integration
3. **New Site**: Click "Add new site" → "Import an existing project"
4. **Connect GitHub**: Authorize Netlify to access your repositories
5. **Select Repository**: Choose `Shatzii/JoeSaanders`
6. **Choose Branch**: Select `copilot/vscode1758026245338`

### 2.2 Configure Build Settings

In the Netlify deployment settings:

```
Build command: npm run build
Publish directory: .next
```

**Advanced Build Settings:**
```
Base directory: joe-sanders-golf
Node version: 18.x
```

---

## 🔐 Step 3: Environment Variables

### 3.1 Required Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

```bash
# OpenAI Configuration (Required for AI Golf Tutor)
OPENAI_API_KEY=sk-proj-your-openai-key-here

# ElevenLabs Configuration (Optional for Voice)
ELEVENLABS_API_KEY=your-elevenlabs-key-here

# Supabase Configuration (Optional for Data)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
```

### 3.2 AI Golf Tutor API Keys

**Get OpenAI API Key:**
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account and navigate to API Keys
3. Create new secret key
4. Copy the key starting with `sk-proj-`

**Get ElevenLabs Key (Optional):**
1. Visit [elevenlabs.io](https://elevenlabs.io)
2. Sign up and go to Profile → API Key
3. Copy your API key

---

## ⚙️ Step 4: Build Configuration

### 4.1 Update package.json

Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  }
}
```

### 4.2 Next.js Configuration

Verify your `next.config.js` is Netlify-compatible:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  }
}

module.exports = nextConfig
```

---

## 🚀 Step 5: Deploy and Test

### 5.1 Trigger Deployment

1. **Auto Deploy**: Push changes to your branch
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin copilot/vscode1758026245338
```

2. **Manual Deploy**: In Netlify Dashboard → Deploys → "Trigger deploy"

### 5.2 Monitor Build Process

Watch the build logs in Netlify Dashboard:
- ✅ Dependencies installation
- ✅ Next.js build process
- ✅ Static export generation
- ✅ Deployment completion

---

## 🧪 Step 6: Verify Functionality

### 6.1 Test Core Features

Visit your deployed site at `https://your-site-name.netlify.app`:

✅ **Homepage loads correctly**
✅ **Navigation works**
✅ **AI Golf Tutor page accessible**
✅ **Simulator demo functions**
✅ **No console errors**

### 6.2 Test AI Golf Tutor

1. Navigate to `/ai-golf-tutor`
2. Click "Try Free Demo"
3. Go to simulator
4. Take a demo shot
5. Verify AI coach responds
6. Test voice coaching (if ElevenLabs configured)

---

## 🔧 Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. **Domain Settings**: Netlify Dashboard → Domain management
2. **Add Custom Domain**: Enter your domain (e.g., `stonesgolf.com`)
3. **DNS Configuration**: Update your domain's DNS settings
4. **SSL Certificate**: Netlify auto-provisions Let's Encrypt SSL

### 7.2 DNS Records

Point your domain to Netlify:
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

---

## 🔍 Step 8: Performance Optimization

### 8.1 Enable Features

In Netlify Dashboard, enable:
- ✅ **Asset Optimization**: Compress CSS, JS, images
- ✅ **Prerendering**: For better SEO
- ✅ **Branch Deploys**: For testing
- ✅ **Deploy Notifications**: Stay informed

### 8.2 Analytics Setup

Add Netlify Analytics:
1. Site Settings → Analytics
2. Enable analytics
3. View traffic insights

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

**Build Failures:**
```bash
# Check Node version
Node version: 18.x or higher

# Verify dependencies
npm install
npm run build
```

**Environment Variables Not Working:**
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
- Restart deployment after adding variables
- Check variable names match exactly

**AI Features Not Working:**
- Verify OpenAI API key is valid
- Check API key has sufficient credits
- Ensure CORS settings allow your domain

**404 Errors:**
- Add `_redirects` file:
```
/* /index.html 200
```

---

## 📊 Step 9: Monitoring and Maintenance

### 9.1 Set Up Monitoring

**Netlify Analytics:**
- Track page views and performance
- Monitor Core Web Vitals
- Identify popular content

**Uptime Monitoring:**
- Use tools like UptimeRobot
- Monitor `/api/health` endpoint
- Set up alerts for downtime

### 9.2 Regular Updates

**Monthly Tasks:**
- Update dependencies
- Check API key credits
- Review performance metrics
- Test all functionalities

---

## 🎯 Step 10: Go Live Checklist

Before announcing your site:

### Pre-Launch Checklist
- [ ] All pages load correctly
- [ ] AI Golf Tutor functions properly
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags in place
- [ ] Analytics tracking active
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Performance optimized
- [ ] Error monitoring set up
- [ ] Backup strategy in place

### Marketing Readiness
- [ ] Social media links work
- [ ] Contact forms functional
- [ ] Sponsorship page complete
- [ ] Tournament system active
- [ ] Demo mode engaging
- [ ] Call-to-actions clear

---

## 🚀 Deployment Commands Summary

```bash
# Quick deployment workflow
cd /workspaces/JoeSaanders/joe-sanders-golf

# 1. Final preparations
npm run build  # Test local build
npm run lint   # Check for issues

# 2. Commit and push
git add .
git commit -m "Ready for Netlify deployment"
git push origin copilot/vscode1758026245338

# 3. Environment variables (set in Netlify Dashboard)
# OPENAI_API_KEY=sk-proj-...
# ELEVENLABS_API_KEY=...
# NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app

# 4. Deploy and monitor
# Watch build logs in Netlify Dashboard
# Test functionality on live site
```

---

## 📞 Support and Resources

**Official Documentation:**
- [Netlify Docs](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [OpenAI API Docs](https://platform.openai.com/docs)

**Community Support:**
- Netlify Community Forum
- Next.js Discord
- GitHub Issues

---

## 🎉 Congratulations!

Your Joe Sanders Golf platform with AI Golf Tutor is now live on Netlify! 

**Your site is accessible at:** `https://your-site-name.netlify.app`

**Key Features Deployed:**
✅ Interactive Golf Simulator
✅ AI-Powered Golf Coaching
✅ Voice Coaching (if configured)
✅ Tournament System
✅ Marketing Pages
✅ Mobile-Optimized Design
✅ Production-Ready Performance

Time to share your amazing golf platform with the world! ⛳🚀