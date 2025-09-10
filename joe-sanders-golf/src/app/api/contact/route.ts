import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      )
    }

    const { name, email, company, message, tier } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Send email to Joe
    await resend.emails.send({
      from: 'Joe Sanders Golf <noreply@joesandersgolf.com>',
      to: process.env.CONTACT_EMAIL || 'joe@joesandersgolf.com',
      subject: `New Sponsorship Inquiry: ${tier || 'General'} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Sponsorship Contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Interest Level:</strong> ${tier || 'General inquiry'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    })

    // Send confirmation email to contact
    await resend.emails.send({
      from: 'Joe Sanders Golf <noreply@joesandersgolf.com>',
      to: email,
      subject: 'Thank you for your interest in Joe Sanders Golf!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Thank You for Reaching Out!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for your interest in sponsoring my professional golf career. I've received your message and will get back to you within 24-48 hours.</p>
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Follow my journey at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://joesandersgolf.com'}">joesandersgolf.com</a></li>
            <li>Check out my latest tournament results</li>
            <li>Explore sponsorship opportunities</li>
          </ul>
          <p>Looking forward to connecting!</p>
          <p>Best regards,<br>Joe Sanders</p>
        </div>
      `,
    })

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
