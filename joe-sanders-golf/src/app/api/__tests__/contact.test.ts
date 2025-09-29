import { NextRequest } from 'next/server'
import { POST } from '@/app/api/contact/route'

// Mock the Resend service
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-email-id' })
    }
  }))
}))

// Mock the rate limiter
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn().mockReturnValue({
    limited: false,
    remaining: 99,
    resetTime: Date.now() + 900000
  })
}))

// Mock the logger
jest.mock('@/lib/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}))

describe('/api/contact', () => {
  let mockRequest: Partial<NextRequest>

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock environment variables
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.CONTACT_EMAIL = 'test@example.com'

    mockRequest = {
      json: jest.fn(),
      headers: {
        get: jest.fn((key: string) => {
          if (key === 'x-forwarded-for') return '127.0.0.1'
          if (key === 'x-real-ip') return '127.0.0.1'
          return null
        }),
        append: jest.fn(),
        delete: jest.fn(),
        getSetCookie: jest.fn(),
        has: jest.fn(),
        set: jest.fn(),
        forEach: jest.fn(),
        entries: jest.fn(),
        keys: jest.fn(),
        values: jest.fn(),
        [Symbol.iterator]: jest.fn()
      }
    }
  })

  it('should send contact email successfully', async () => {
    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    }

    ;(mockRequest.json as jest.Mock).mockResolvedValue(contactData)

    const response = await POST(mockRequest as NextRequest)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.message).toBe('Message sent successfully!')
  })

  it('should validate required fields', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      subject: 'Test',
      message: 'Test'
    }

    ;(mockRequest.json as jest.Mock).mockResolvedValue(invalidData)

    const response = await POST(mockRequest as NextRequest)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.error).toBe('Invalid input data')
    expect(result.details).toBeDefined()
  })

  it('should handle rate limiting', async () => {
    const { checkRateLimit } = require('@/lib/rate-limit')
    ;(checkRateLimit as jest.Mock).mockReturnValue({
      limited: true,
      remaining: 0,
      resetTime: Date.now() + 900000
    })

    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    }

    ;(mockRequest.json as jest.Mock).mockResolvedValue(contactData)

    const response = await POST(mockRequest as NextRequest)
    const result = await response.json()

    expect(response.status).toBe(429)
    expect(result.error).toContain('Too many requests')
  })

  it('should handle missing Resend configuration', async () => {
    // Remove the RESEND_API_KEY to simulate missing config
    delete process.env.RESEND_API_KEY

    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    }

    ;(mockRequest.json as jest.Mock).mockResolvedValue(contactData)

    const response = await POST(mockRequest as NextRequest)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.error).toBe('Service configuration error')
  })

  it('should handle email sending errors gracefully', async () => {
    const { Resend } = require('resend')
    const mockResendInstance = {
      emails: {
        send: jest.fn().mockRejectedValue(new Error('Email service error'))
      }
    }
    ;(Resend as jest.Mock).mockImplementation(() => mockResendInstance)

    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    }

    ;(mockRequest.json as jest.Mock).mockResolvedValue(contactData)

    const response = await POST(mockRequest as NextRequest)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.error).toContain('Failed to send message')
  })
})
