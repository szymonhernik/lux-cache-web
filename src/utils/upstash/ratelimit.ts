import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create separate caches for each ratelimiter
const defaultCache = new Map()
const strictCache = new Map()
const lenientCache = new Map()

// Default ratelimiter: 10 requests per 60 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  ephemeralCache: defaultCache,
  analytics: true,
  prefix: '@upstash/ratelimit'
})

// Stricter ratelimiter for sensitive operations (5 requests per minute)
export const strictRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit:strict',
  ephemeralCache: strictCache
})

// More lenient ratelimiter for common operations (100 requests per minute)
export const lenientRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit:lenient',
  ephemeralCache: lenientCache
})
