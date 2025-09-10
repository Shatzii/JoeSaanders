import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  payment_method_types: ['card'],
  shipping_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'JP'],
}

// Product price IDs (these would be actual Stripe price IDs in production)
export const STRIPE_PRICES = {
  // Fan Club memberships
  fan_club_monthly: 'price_monthly_999',
  fan_club_annual: 'price_annual_9999',
  fan_club_family: 'price_family_14999',
  
  // Sample merchandise (would be actual Stripe price IDs)
  polo_navy: 'price_polo_navy_8500',
  golf_cap: 'price_golf_cap_3500',
  golf_glove: 'price_golf_glove_2800',
  golf_balls: 'price_golf_balls_5500',
  signed_photo: 'price_signed_photo_4500',
  golf_towel: 'price_golf_towel_2500',
}

// Shipping rates
export const SHIPPING_RATES = {
  free_shipping_threshold: 7500, // $75.00 in cents
  standard_shipping: 995, // $9.95 in cents
  express_shipping: 1995, // $19.95 in cents
  international_shipping: 2995, // $29.95 in cents
}

// Helper function to format price for display
export const formatStripePrice = (priceInCents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceInCents / 100)
}