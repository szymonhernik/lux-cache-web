import { headers } from 'next/headers'
import { ratelimit } from './ratelimit'

export async function checkRateLimit(scope: string) {
  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
  const ja4 = headersList.get('x-vercel-ja4-digest') || 'dev'

  const identifier = `${scope}:${ip}:${ja4}`

  const { success } = await ratelimit.limit(identifier)
  if (!success) {
    throw new Error('Rate limit exceeded')
  }
}
