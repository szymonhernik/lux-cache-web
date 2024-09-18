import { NextResponse } from 'next/server'
import { connectDiscord } from '@/app/(pages)/(account)/account/subscription/_components/discord/actions'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    await connectDiscord(code)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscription?discord=connected`
    )
  } catch (error) {
    console.error('Error connecting Discord:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscription?discord=error&error=${error}`
    )
  }
}
