import Redis from 'ioredis'

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3,
}

// Create Redis client instances
let redisClient: Redis | null = null
let redisPubClient: Redis | null = null
let redisSubClient: Redis | null = null

// Initialize Redis clients for Socket.IO adapter
export function getRedisClients() {
  if (!redisClient) {
    redisClient = new Redis(redisConfig)
    redisClient.on('error', (err) => {
      console.error('[Redis] Client error:', err)
    })
    redisClient.on('connect', () => {
      console.log('[Redis] Client connected')
    })
  }

  if (!redisPubClient) {
    redisPubClient = new Redis(redisConfig)
    redisPubClient.on('error', (err) => {
      console.error('[Redis] Pub client error:', err)
    })
  }

  if (!redisSubClient) {
    redisSubClient = new Redis(redisConfig)
    redisSubClient.on('error', (err) => {
      console.error('[Redis] Sub client error:', err)
    })
  }

  return { redisClient, pubClient: redisPubClient, subClient: redisSubClient }
}

// Rate limiting with Redis
export async function checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return false

  try {
    const current = await redisClient.incr(key)
    if (current === 1) {
      await redisClient.expire(key, window)
    }
    return current > limit
  } catch (error) {
    console.error('[Redis] Rate limit check failed:', error)
    return false
  }
}

// Session storage with Redis
export async function setSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return

  try {
    await redisClient.setex(`session:${sessionId}`, ttl, JSON.stringify(data))
  } catch (error) {
    console.error('[Redis] Set session failed:', error)
  }
}

export async function getSession(sessionId: string): Promise<any | null> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return null

  try {
    const data = await redisClient.get(`session:${sessionId}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('[Redis] Get session failed:', error)
    return null
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return

  try {
    await redisClient.del(`session:${sessionId}`)
  } catch (error) {
    console.error('[Redis] Delete session failed:', error)
  }
}

// Cache utilities
export async function cacheSet(key: string, value: any, ttl: number = 300): Promise<void> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return

  try {
    await redisClient.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('[Redis] Cache set failed:', error)
  }
}

export async function cacheGet(key: string): Promise<any | null> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return null

  try {
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('[Redis] Cache get failed:', error)
    return null
  }
}

export async function cacheDelete(key: string): Promise<void> {
  const { redisClient } = getRedisClients()
  if (!redisClient) return

  try {
    await redisClient.del(key)
  } catch (error) {
    console.error('[Redis] Cache delete failed:', error)
  }
}

export default redisClient
