import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import logger from '@/lib/logger'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'
    const rateLimit = checkRateLimit(clientIP)

    if (rateLimit.limited) {
      logger.warn('Rate limit exceeded', { ip: clientIP })
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Contact form validation failed', {
        errors: validationResult.error.errors,
        ip: clientIP
      })
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validationResult.data

    if (!resend) {
      logger.warn('Resend service not configured - falling back to development mode')
      // In development, just log the message and return success
      logger.info('Contact form submission (development mode)', { name, email, subject })
      return NextResponse.json(
        { message: 'Message sent successfully! (Development mode)' },
        { status: 200 }
      )
    }

    logger.info('Sending contact email', { name, email, subject })

    // Send email to Joe
    await resend.emails.send({
      from: 'Uncle Joes Golf <noreply@unclejoesgolf.com>',
      to: process.env.CONTACT_EMAIL || 'joe@unclejoesgolf.com',
      subject: `New Contact: ${subject} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      `,
    })

    // Send confirmation email to contact
    await resend.emails.send({
      from: 'Uncle Joes Golf <noreply@unclejoesgolf.com>',
      to: email,
      subject: 'Thank you for your interest in Uncle Joes Golf!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">Thank You for Reaching Out!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for your interest in sponsoring my professional golf career. I've received your message and will get back to you within 24-48 hours.</p>
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Follow my journey at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://unclejoesgolf.com'}">unclejoesgolf.com</a></li>
            <li>Check out my latest tournament results</li>
            <li>Explore sponsorship opportunities</li>
          </ul>
          <p>Looking forward to connecting!</p>
          <p>Best regards,<br>Uncle Joe</p>
        </div>
      `,
    })

    logger.info('Contact email sent successfully', { name, email })

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    logger.error('Contact form error', { error: errorMessage, stack: errorStack })
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
