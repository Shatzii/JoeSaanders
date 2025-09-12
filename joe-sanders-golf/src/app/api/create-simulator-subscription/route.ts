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

    const { userId, tier } = await request.json()

    if (!userId || !tier) {
      return NextResponse.json(
        { error: 'User ID and tier are required' },
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

    // Set price based on tier
    const prices = {
      pro: 'price_simulator_pro', // You'll need to create these in Stripe
      elite: 'price_simulator_elite'
    }

    const priceId = prices[tier as keyof typeof prices]
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
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

    // Create checkout session for simulator subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/simulator?success=true&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/simulator?canceled=true`,
      metadata: {
        user_id: userId,
        subscription_type: 'simulator',
        tier: tier
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          subscription_type: 'simulator',
          tier: tier
        }
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Simulator subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create simulator subscription' },
      { status: 500 }
    )
  }
}