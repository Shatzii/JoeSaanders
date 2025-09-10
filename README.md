# Joe Sanders Golf - Professional Golfer Website

A modern, professional website built for golfer Joe Sanders featuring tournament tracking, merchandise shop, fan club membership, and sponsorship opportunities. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Joe Sanders Golf Website](https://github.com/user-attachments/assets/f2d05ab8-ebf1-4b1e-b2e0-576407a84c17)

## 🏌️ Features

### Core Pages
- **Home Page**: Hero section, career statistics, personal story
- **Tournament Journey**: Dynamic hub with tournament recaps and results
- **Sponsorship Tiers**: Professional partnership opportunities
- **Merchandise Shop**: Stripe-powered e-commerce with golf merchandise
- **Fan Club**: Membership subscriptions with exclusive benefits

### Technical Features
- 🚀 **Next.js 14** with App Router and Turbopack
- 🎯 **TypeScript** for type safety
- 🎨 **Tailwind CSS v4** for responsive design
- 🗄️ **Supabase** for database and authentication
- 💳 **Stripe** integration for payments
- 📝 **Decap CMS** for content management
- 📱 **Mobile-first responsive design**
- 🔍 **SEO optimized** with proper metadata
- ⚡ **Performance optimized** static generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shatzii/JoeSaanders.git
   cd JoeSaanders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables (see [Environment Variables](#environment-variables) section).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Stripe Configuration
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Netlify Identity (for Decap CMS)
```env
NETLIFY_SITE_ID=your-netlify-site-id
NETLIFY_ACCESS_TOKEN=your-netlify-access-token
```

### Optional Services
```env
GOOGLE_ANALYTICS_ID=GA-MEASUREMENT-ID
SMTP_HOST=smtp.example.com
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
```

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the project URL and anon key to your `.env.local`

### 2. Create Database Tables
Run these SQL commands in the Supabase SQL editor:

```sql
-- Create tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  result TEXT,
  purse BIGINT NOT NULL,
  earnings BIGINT,
  description TEXT,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('apparel', 'equipment', 'accessories')),
  in_stock BOOLEAN DEFAULT true,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create users table (extends auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  membership_tier TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
```

## 💳 Stripe Setup

### 1. Create Stripe Account
1. Sign up at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys
3. Add them to your `.env.local`

### 2. Create Products and Prices
Create products in Stripe Dashboard for:
- Fan club monthly membership ($9.99)
- Fan club annual membership ($99.99)
- Golf merchandise items

### 3. Set up Webhooks
1. Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
2. Listen for events: `checkout.session.completed`, `invoice.payment_succeeded`
3. Add webhook secret to `.env.local`

## 📝 Content Management (Decap CMS)

### 1. Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Deploy the site
3. Enable Netlify Identity in site settings

### 2. Configure Git Gateway
1. Go to Site Settings > Identity
2. Enable Git Gateway
3. Add admin users

### 3. Access CMS
Visit `https://yoursite.netlify.app/admin` to access the content management interface.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── fan-club/          # Fan club membership page
│   ├── journey/           # Tournament journey hub
│   ├── shop/              # Merchandise shop
│   ├── sponsorship/       # Partnership opportunities
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── stripe.ts         # Stripe configuration
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
public/
├── admin/                # Decap CMS configuration
└── images/               # Static images
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Components use Tailwind CSS classes for styling

### Content
- Edit page content directly in the component files
- Use Decap CMS for managing tournaments, products, and blog posts
- Update metadata in `src/app/layout.tsx`

### Branding
- Replace logo and favicon in `/public`
- Update color scheme in Tailwind configuration
- Modify brand name throughout the application

## 🚀 Deployment

### Recommended: Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Alternative: Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- AWS Amplify
- Railway
- Render
- Self-hosted

## 📊 Analytics & Monitoring

### Google Analytics
Add your GA4 measurement ID to the environment variables to enable tracking.

### Error Monitoring
Consider adding error monitoring services like:
- Sentry
- LogRocket
- Bugsnag

## 🔐 Security Considerations

- Environment variables are properly configured
- Supabase RLS policies protect user data
- Stripe webhooks are verified
- Input validation on all forms
- HTTPS enforced in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For technical support or questions:
- Email: tech@joesanders.golf
- Documentation: Check this README and inline code comments
- Issues: Create a GitHub issue for bugs or feature requests

## 🔄 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npm run db:generate  # Generate Supabase types
npm run db:reset     # Reset local database
```

---

Built with ❤️ for professional golf
