import { NextResponse } from 'next/server'
import { connectDiscord } from '@/app/(pages)/(account)/account/subscription/_components/discord/actions'
import { cookies } from 'next/headers'

// Discord's OAuth domain
const DISCORD_DOMAIN = 'discord.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const cookieStore = cookies()

  // Verify state parameter
  const storedState = cookieStore.get('discord_oauth_state')?.value
  if (!state || !storedState || state !== storedState) {
    console.warn('Invalid OAuth state')
    return new Response('Forbidden', { status: 403 })
  }

  // Clear the state cookie after verification
  cookieStore.delete('discord_oauth_state')

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscription?discord=error&error=${encodeURIComponent('No authorization code provided')}`
    )
  }

  try {
    await connectDiscord(code)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscription?discord=connected`
    )
  } catch (error) {
    console.error('Error connecting Discord:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscription?discord=error&error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`
    )
  }
}
