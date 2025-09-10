# Joe Sanders Pro Golf Career Launch Platform

Welcome to the Joe Sanders Pro Golf Career Launch Platform! This project aims to create a dynamic digital hub for professional golfer Joe Sanders, designed to attract sponsors, build a fanbase, generate revenue, and document his professional journey.

## Table of Contents
- [Project Goals](#project-goals)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## Project Goals
- Build a professional website to showcase Joe Sanders' golf career.
- Integrate e-commerce capabilities for merchandise sales and fan subscriptions.
- Provide a content management system for easy updates.
- Implement analytics to track user engagement and site performance.

## Technologies Used
- **Frontend Framework:** Next.js 14 (with App Router)
- **Styling:** Tailwind CSS
- **Content Management:** Decap CMS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **E-commerce:** Stripe
- **Email Marketing:** Resend
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics or Plausible

## Project Structure
```
joe-sanders-golf/
├── .github/
│   └── workflows/         # CI/CD pipelines
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router (pages, layouts)
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities, Stripe config, Supabase client
│   ├── styles/           # Global Tailwind CSS
│   └── types.ts          # TypeScript type definitions
├── content/              # Decap CMS config and uploads
├── scripts/              # Any seed scripts or utilities
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/Shatzii/JoeSaanders.git
   cd joe-sanders-golf
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `scripts/schema.sql` and run it
   - Go to Authentication > Settings and configure your site URL and redirect URLs
   - Get your project URL and anon key from Settings > API

4. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase URL and keys
   - Add other API keys as needed

5. Run the development server:
   ```
   npm run dev
   ```

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations)
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `RESEND_API_KEY`: Your Resend API key
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`: Your Vercel Analytics ID (optional)
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID for Decap CMS
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret for Decap CMS
- `MAILCHIMP_API_KEY`: Mailchimp API key (optional)
- `MAILCHIMP_LIST_ID`: Mailchimp list ID (optional)

## Deployment Instructions
1. **Vercel Deployment:**
   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard (see Environment Variables section)
   - Deploy the main branch
   - The build should complete successfully with no TypeScript errors

2. **Supabase Database Setup:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `scripts/schema.sql` and run it
   - This creates all necessary tables, policies, and triggers

3. **Stripe Configuration:**
   - Create products and prices in Stripe dashboard for merchandise and subscriptions
   - Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Copy the webhook secret to your environment variables
   - Test webhook delivery in Stripe dashboard

4. **Email Setup (Resend):**
   - Create account at [resend.com](https://resend.com)
   - Verify your domain for sending emails
   - Add API key to environment variables
   - Test email sending from contact forms

5. **Decap CMS Setup:**
   - Access the CMS at `/admin` after deployment
   - Configure GitHub OAuth for authentication
   - Add content through the CMS interface for tournaments, sponsors, and merch

## Testing Checklist
- [ ] Homepage loads with hero video and sponsor logos
- [ ] Journey page displays tournament list
- [ ] Individual tournament pages show details and media
- [ ] Shop page displays merchandise with Stripe checkout
- [ ] Fan Club page handles authentication and subscriptions
- [ ] Contact form sends emails successfully
- [ ] Newsletter signup works and sends welcome emails
- [ ] Stripe webhooks process payments correctly
- [ ] Responsive design works on all devices
- [ ] All forms validate input properly

## Current Status
✅ **Completed Features:**
- Full Next.js 14 application with TypeScript
- Responsive design with Tailwind CSS
- Supabase database integration with full schema
- Stripe payment processing for merch and subscriptions
- Email integration with Resend
- Decap CMS configuration
- CI/CD pipeline with GitHub Actions
- Vercel deployment configuration
- All API routes implemented and tested
- TypeScript compilation successful

🚀 **Ready for Production:**
- All code compiles without errors
- Environment variables properly configured
- Database schema ready for execution
- Deployment configurations complete