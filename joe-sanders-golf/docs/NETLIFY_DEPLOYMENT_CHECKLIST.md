# 🚀 Netlify Deployment Checklist - Uncle Joe's Golf

## 📋 Deployment Configuration Summary

### **Project Details:**
- **Project Name:** `coolstones`
- **Team:** `Shatzii Squad`
- **Repository:** `JoeSaanders`
- **Branch:** `main`
- **Live URL:** `https://coolstones.netlify.app`

---

## ⚙️ Build Settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Base Directory** | `joe-sanders-golf` | Where dependencies are installed |
| **Build Command** | `npm run build` | Standard Next.js build (no static export) |
| **Publish Directory** | `.` | Current directory (Next.js handles serving) |
| **Functions Directory** | `src/app/api` | API routes handled automatically |
| **Node Version** | `20` | Specified in netlify.toml |

---

## 🔐 Environment Variables

### **Copy-Paste Ready (Public + Secret Variables):**

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
```

### **Environment Variable Settings:**
- **Scopes:** All scopes (Builds, Functions, Runtime, Post processing)
- **Deploy Contexts:** All deploy contexts (Production, Deploy Previews, Branch deploys)

---

## 📝 Step-by-Step Deployment Instructions

### **1. Connect Repository**
- Go to [Netlify Dashboard](https://app.netlify.com)
- Click "Add new site" → "Import an existing project"
- Connect your GitHub account
- Select repository: `Shatzii/JoeSaanders`

### **2. Configure Site Settings**
- **Site name:** `coolstones`
- **Team:** `Shatzii Squad`
- **Branch:** `main`

### **3. Set Build Settings**
- **Base directory:** `joe-sanders-golf`
- **Build command:** `npm run build`
- **Publish directory:** `.`
- **Node version:** `20` (auto-detected from netlify.toml)

### **4. Add Environment Variables**
- Go to "Site settings" → "Environment variables"
- Click "Add variable" or use bulk import
- Copy-paste the environment variables block above
- **Important:** Replace `STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here` with your actual webhook secret

### **5. Deploy**
- Click "Deploy site"
- Wait for build completion
- Your site will be live at: `https://coolstones.netlify.app`

---

## ✅ Pre-Deployment Checklist

- [ ] Repository connected to Netlify
- [ ] Project name set to `coolstones`
- [ ] Team set to `Shatzii Squad`
- [ ] Branch set to `main`
- [ ] Base directory: `joe-sanders-golf`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.`
- [ ] All environment variables added
- [ ] Stripe webhook secret configured
- [ ] Site deployed successfully

---

## 🔧 Post-Deployment Configuration

### **Stripe Webhook Setup (Required for Payments)**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Add endpoint: `https://coolstones.netlify.app/api/webhooks/stripe`
3. Copy the webhook secret and update `STRIPE_WEBHOOK_SECRET` in Netlify

### **Domain Configuration (Optional)**
- Go to Site settings → Domain management
- Add custom domain if needed
- Update Auth0 and other services with the new domain

### **Testing**
- Visit `https://coolstones.netlify.app`
- Test user authentication
- Test payment flows
- Verify AI golf coaching features

---

## 🚨 Important Notes

- **Environment Variables:** All sensitive data is properly secured
- **Build Process:** Uses standard Next.js build for full server-side functionality
- **API Routes:** Next.js API routes work automatically on Netlify
- **Middleware:** Authentication middleware is fully functional
- **Security:** Secrets are encrypted and only accessible during builds

---

## 📞 Support

If you encounter any issues during deployment:
1. Check the build logs in Netlify dashboard
2. Verify all environment variables are set correctly
3. Ensure webhook secret is properly configured
4. Check that all API keys are valid and haven't expired

**Your Uncle Joe's Golf platform is now configured for full Next.js deployment on Netlify! 🎉**