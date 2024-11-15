import { headers } from 'next/headers'
import {
  lenientRatelimit,
  longTermRatelimit,
  ratelimit,
  strictRatelimit
} from './ratelimit'

export async function checkRateLimit(scope: string) {
  const headersList = headers()
  const ja4 = headersList.get('x-vercel-ja4-digest') || 'dev'

  const identifier = `${scope}:${ja4}`

  const { success } = await ratelimit.limit(identifier)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }
}

export async function checkStrictRateLimit(scope: string) {
  const headersList = headers()
  const ja4 = headersList.get('x-vercel-ja4-digest') || 'dev'

  const identifier = `${scope}:${ja4}`

  const { success } = await strictRatelimit.limit(identifier)
  if (!success) {
    throw new Error('Strict rate limit exceeded')
  }
}

export async function checkLenientRateLimit(scope: string) {
  const headersList = headers()
  const ja4 = headersList.get('x-vercel-ja4-digest') || 'dev'

  const identifier = `${scope}:${ja4}`

  const { success } = await lenientRatelimit.limit(identifier)
  if (!success) {
    throw new Error('Lenient rate limit exceeded')
  }
}

export async function checkLongTermRateLimit(scope: string, userId: string) {
  const identifier = `${scope}:${userId}`
  const { success } = await longTermRatelimit.limit(identifier)
  if (!success) {
    throw new Error('Long term rate limit exceeded')
  }
}

// add a rate limitting that isn't based on the ja4 digest and ip address, it will be mostly used by Discord OAuth but i don't want it to be executed more than 100 times per minute

export async function checkAPIRateLimit(scope: string) {
  const { success } = await lenientRatelimit.limit(`${scope}`)
  if (!success) {
    throw new Error('Discord rate limit exceeded')
  }
}
