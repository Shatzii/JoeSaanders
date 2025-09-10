import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Add to Supabase newsletter table
    const { error: dbError } = await supabase
      .from('newsletter_emails')
      .insert([{ email }])

    if (dbError && !dbError.message.includes('duplicate key')) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    // Send welcome email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Joe Sanders Golf <noreply@joesandersgolf.com>',
          to: email,
          subject: 'Welcome to Joe Sanders Golf!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #16a34a;">Welcome to the Joe Sanders Golf Community!</h1>
              <p>Thank you for subscribing to updates about my professional golf journey.</p>
              <p>You'll be the first to know about:</p>
              <ul>
                <li>Tournament results and highlights</li>
                <li>Behind-the-scenes content</li>
                <li>Exclusive merchandise releases</li>
                <li>Fan Club opportunities</li>
              </ul>
              <p>Follow my progress at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://joesandersgolf.com'}">joesandersgolf.com</a></p>
              <p>Best regards,<br>Joe Sanders</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}