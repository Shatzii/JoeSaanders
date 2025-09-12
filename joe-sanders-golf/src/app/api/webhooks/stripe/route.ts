import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!stripe || !supabaseServer || !endpointSecret) {
    return NextResponse.json(
      { error: 'Service configuration error' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.metadata?.user_id) {
          const userId = session.metadata.user_id
          const subscriptionId = session.subscription as string
          const tier = session.metadata.tier || 'pro'

          // Update user profile to mark as fan club member and set subscription tier
          await supabaseServer
            .from('profiles')
            .update({
              is_fan_club_member: true,
              subscription_tier: tier
            })
            .eq('id', userId)

          // Create subscription record
          await supabaseServer
            .from('fan_club_subscriptions')
            .insert({
              user_id: userId,
              stripe_subscription_id: subscriptionId,
              status: 'active',
            })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        const subscriptionId = (invoice as any).subscription
        if (subscriptionId) {
          // Update subscription status
          await supabaseServer
            .from('fan_club_subscriptions')
            .update({ status: 'active' })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const subscriptionId = (invoice as any).subscription
        if (subscriptionId) {
          // Update subscription status
          await supabaseServer
            .from('fan_club_subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status and remove fan club access
        await supabaseServer
          .from('fan_club_subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        // Find the user and update their profile
        const { data: subscriptionData } = await supabaseServer
          .from('fan_club_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (subscriptionData) {
          await supabaseServer
            .from('profiles')
            .update({ is_fan_club_member: false })
            .eq('id', subscriptionData.user_id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
