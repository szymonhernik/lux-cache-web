'use server'

import { createClient } from '@/utils/supabase/server'
import {
  getDiscordIntegration,
  updateDiscordIntegration
} from '@/utils/supabase/admin'
import { getSubscription } from '@/utils/supabase/queries'

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/discord`

export async function getDiscordConnectionStatus() {
  const supabase = createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error getting user:', userError)
    return false
  }

  const discordIntegration = await getDiscordIntegration(user.id)
  return discordIntegration?.connection_status ?? false
}

export async function disconnectDiscord() {
  const supabase = createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('User not authenticated')

  await updateDiscordIntegration(user.id, {
    connection_status: false,
    discord_id: null,
    connected_at: null
  })

  // TODO: Implement Discord API call to remove user from server or roles
}

export async function initiateDiscordConnection() {
  const scope = 'identify guilds.join'
  return `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`
}

export async function connectDiscord(code: string) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('User not authenticated')

  // TODO: Implement Discord OAuth token exchange
  // const tokenResponse = await exchangeCodeForToken(code)
  // const discordUser = await getDiscordUserInfo(tokenResponse.access_token)

  // Update user's Discord info in Supabase
  await updateDiscordIntegration(user.id, {
    connection_status: true,
    discord_id: 'discordUser.id', // Replace with actual Discord user ID
    connected_at: new Date().toISOString()
  })

  const subscription = await getSubscription(supabase)
  if (subscription) {
    // TODO: Implement Discord role assignment based on subscription tier
    // await assignDiscordRoles(discordUser.id, subscription.price?.product?.name)
  }
}

// Helper functions (to be implemented later)
// async function exchangeCodeForToken(code: string) { ... }
// async function getDiscordUserInfo(accessToken: string) { ... }
// async function assignDiscordRoles(userId: string, tier: string) { ... }
