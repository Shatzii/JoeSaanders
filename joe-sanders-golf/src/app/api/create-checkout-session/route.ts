import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

// Mock product data for development
const mockProducts = {
  'price_cap_001': {
    name: 'Official Uncle Joe Cap',
    description: 'Show your support with the official Uncle Joe golf cap',
    price: 2500, // $25.00 in cents
    image: '/images/merch-cap.svg'
  },
  'price_polo_001': {
    name: 'Stones Golf Polo',
    description: 'Premium performance polo featuring the Stones Golf logo',
    price: 4500, // $45.00 in cents
    image: '/images/merch-polo.svg'
  },
  'price_towel_001': {
    name: 'Uncle Joe Towel',
    description: 'Absorbent microfiber towel perfect for the course',
    price: 1500, // $15.00 in cents
    image: '/images/merch-towel.svg'
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      )
    }

    const { priceId, quantity = 1, amount, type } = await request.json()

    // Handle premium unlock separately
    if (type === 'premium_unlock') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Uncle Joe Golf Simulator Premium',
                description: 'Unlock full leaderboard access, historical challenges, and VS Joe mode',
              },
              unit_amount: amount || 500, // $5.00 default
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/simulator?premium=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/simulator?premium=cancelled`,
        metadata: {
          type: 'premium_unlock',
        },
      })

      return NextResponse.json({
        sessionId: session.id,
        url: session.url
      })
    }

    // Handle regular merchandise
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    // Get product details (in production, this would come from Stripe)
    const product = mockProducts[priceId as keyof typeof mockProducts]

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
            },
            unit_amount: product.price,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop?canceled=true`,
      metadata: {
        priceId,
        quantity: quantity.toString()
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
