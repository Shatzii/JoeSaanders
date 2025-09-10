// Simple in-memory rate limiter (for production, use Redis)
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()

  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15 minutes
    private maxRequests: number = 100
  ) {}

  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier)

    if (!userRequests || now > userRequests.resetTime) {
      // Reset or initialize
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return false
    }

    if (userRequests.count >= this.maxRequests) {
      return true
    }

    userRequests.count++
    return false
  }

  getRemainingRequests(identifier: string): number {
    const userRequests = this.requests.get(identifier)
    if (!userRequests) return this.maxRequests

    return Math.max(0, this.maxRequests - userRequests.count)
  }

  getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier)
    return userRequests?.resetTime || Date.now() + this.windowMs
  }
}

export const rateLimiter = new RateLimiter()

export function checkRateLimit(identifier: string) {
  if (rateLimiter.isRateLimited(identifier)) {
    return {
      limited: true,
      remaining: 0,
      resetTime: rateLimiter.getResetTime(identifier)
    }
  }

  return {
    limited: false,
    remaining: rateLimiter.getRemainingRequests(identifier),
    resetTime: rateLimiter.getResetTime(identifier)
  }
}
