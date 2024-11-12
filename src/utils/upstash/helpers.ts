import { headers } from 'next/headers'
import { lenientRatelimit, ratelimit, strictRatelimit } from './ratelimit'

export async function checkRateLimit(scope: string) {
  const headersList = headers()
  const ja4 = headersList.get('x-vercel-ja4-digest') || 'dev'

  const identifier = `${scope}:${ja4}`

  const { success, reason } = await ratelimit.limit(identifier)

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
