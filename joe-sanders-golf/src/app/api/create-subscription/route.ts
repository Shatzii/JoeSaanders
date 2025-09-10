import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !supabaseServer) {
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Create or retrieve Stripe customer
    let customer
    if (profile.stripe_customer_id) {
      customer = await stripe.customers.retrieve(profile.stripe_customer_id)
    } else {
      customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name || undefined,
        metadata: {
          user_id: userId,
        },
      })

      // Update profile with Stripe customer ID
      await supabaseServer
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', userId)
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Joe Sanders Fan Club',
              description: 'Monthly subscription for exclusive content and benefits',
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/fan-club?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/fan-club?canceled=true`,
      metadata: {
        user_id: userId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
