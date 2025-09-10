import { NextRequest, NextResponse } from 'next/server'
import { dataClient } from '@/lib/data-client'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Add to newsletter (using data client)
    try {
      await dataClient.subscribeToNewsletter(email)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      // Continue even if local storage fails
    }

    // Send welcome email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Uncle Joes Golf <noreply@unclejoesgolf.com>',
          to: email,
          subject: 'Welcome to Uncle Joes Golf!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #d4af37;">Welcome to the Uncle Joes Golf Community!</h1>
              <p>Thank you for subscribing to updates about my professional golf journey.</p>
              <p>You'll be the first to know about:</p>
              <ul>
                <li>Tournament results and highlights</li>
                <li>Behind-the-scenes content</li>
                <li>Exclusive merchandise releases</li>
                <li>Fan Club opportunities</li>
              </ul>
              <p>Follow my progress at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}">unclejoesgolf.com</a></p>
              <p>Best regards,<br>Uncle Joe</p>
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