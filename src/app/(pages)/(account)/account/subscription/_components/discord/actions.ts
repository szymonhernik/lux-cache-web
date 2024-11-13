'use server'

import { createClient } from '@/utils/supabase/server'
import { updateDiscordIntegration } from '@/utils/supabase/admin'
import { getSubscription, getUser } from '@/utils/supabase/queries'
import { cache } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { isAuthenticated } from '@/utils/data/auth'
import { createHash } from 'crypto'
import { cookies } from 'next/headers'

const DISCORD_AUTH_URL = 'https://discord.com/oauth2/authorize'
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID!
const DISCORD_BOT_PERMISSIONS = process.env.DISCORD_BOT_PERMISSIONS!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/discord`
const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10'

// Define Discord role IDs
const DISCORD_ROLES = {
  PREMIUM: process.env.DISCORD_PREMIUM_ROLE_ID!,
  SUBSCRIBER: process.env.DISCORD_SUBSCRIBER_ROLE_ID!,
  SUPPORTER: process.env.DISCORD_SUPPORTER_ROLE_ID!
}

// Main functions

export const getDiscordConnectionStatus = cache(
  async (supabase: SupabaseClient) => {
    const { data: discordIntegration, error } = await supabase
      .from('discord_integration')
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('Error fetching Discord integration:', error)
      return { status: false, error: 'Error fetching Discord integration' }
    }

    return {
      status: discordIntegration?.connection_status ?? false,
      error: null
    }
  }
)

const generateState = (userId: string) => {
  // recommended to use State in in https://discord.com/developers/docs/topics/oauth2
  if (!process.env.DISCORD_OAUTH_SECRET) {
    throw new Error('DISCORD_OAUTH_SECRET is not set')
  }

  const timestamp = Date.now().toString()
  return createHash('sha256')
    .update(userId + timestamp + process.env.DISCORD_OAUTH_SECRET)
    .digest('hex')
}

export async function initiateDiscordConnection() {
  const supabase = createClient()
  const user = await getUser(supabase)

  if (!user) {
    throw new Error('User not authenticated')
  }

  const state = generateState(user.id)
  // Store state in a secure cookie
  const cookieStore = cookies()
  // Delete existing state cookie if it exists
  cookieStore.delete('discord_oauth_state')
  // Set new state cookie
  cookieStore.set('discord_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5 // 5 minutes
  })

  const scope = 'identify guilds.join'

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    permissions: DISCORD_BOT_PERMISSIONS,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: scope,
    state: state
  })

  return `${DISCORD_AUTH_URL}?${params.toString()}`
}

export async function connectDiscord(code: string) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('User not authenticated')

  try {
    // Step 1: Exchange code for token
    const tokenResponse = await exchangeCodeForToken(code)

    // Step 2: Get Discord user info
    const discordUser = await getDiscordUserInfo(tokenResponse.access_token)

    // Step 3: Add user to Discord server
    await addUserToDiscordServer(discordUser.id, tokenResponse.access_token)

    // Step 4: Get user's subscription and assign roles
    const subscription = await getSubscription(supabase)
    if (subscription?.prices?.products?.name) {
      await assignDiscordRoles(
        discordUser.id,
        subscription.prices.products.name
      )
    }
    // TODO: Verify that when you call this function, it's coming from a secure source like in stripe webhook route
    // Step 5: Update Discord integration status in the database
    await updateDiscordIntegration(user.id, {
      connection_status: true,
      discord_id: discordUser.id,
      connected_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in connectDiscord:', error)
    throw error
  }
}

// Helper functions

async function exchangeCodeForToken(code: string) {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    })
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return response.json()
}

async function getDiscordUserInfo(accessToken: string) {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  if (!response.ok) {
    throw new Error('Failed to get Discord user info')
  }

  return response.json()
}

async function addUserToDiscordServer(userId: string, accessToken: string) {
  const guildId = process.env.DISCORD_GUILD_ID!
  console.log('Attempting to add user to guild:', guildId)

  const response = await fetch(
    `${DISCORD_API_ENDPOINT}/guilds/${guildId}/members/${userId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ access_token: accessToken })
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `Failed to add user to Discord server: ${response.status} ${errorBody}`
    )
  }
}

export async function assignDiscordRoles(userId: string, tier: string) {
  if (!DISCORD_GUILD_ID) {
    throw new Error('DISCORD_GUILD_ID is not set in environment variables')
  }
  const newRoleId = getRoleIdForTier(tier)
  const rolesToRemove = [
    DISCORD_ROLES.SUPPORTER,
    DISCORD_ROLES.SUBSCRIBER,
    DISCORD_ROLES.PREMIUM
  ]

  try {
    // Fetch current roles of the user
    const memberResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${DISCORD_GUILD_ID}/members/${userId}`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
      }
    )

    if (!memberResponse.ok) {
      const errorBody = await memberResponse.text()
      throw new Error(
        `Failed to fetch user roles: ${memberResponse.status} ${errorBody}`
      )
    }

    const memberData = await memberResponse.json()
    const currentRoles = memberData.roles

    if (newRoleId === null) {
      return
    }

    // Check if the new role is already assigned
    if (currentRoles.includes(newRoleId)) {
      console.log('User already has the correct role:', newRoleId)
      return
    }

    // Remove roles that the user has and are in the rolesToRemove array
    const rolesToRemovePromises = rolesToRemove
      .filter((role) => currentRoles.includes(role) && role !== newRoleId)
      .map(async (role) => {
        try {
          const removeRoleResponse = await fetch(
            `${DISCORD_API_ENDPOINT}/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${role}`,
            {
              method: 'DELETE',
              headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
            }
          )

          if (!removeRoleResponse.ok) {
            const errorBody = await removeRoleResponse.text()
            console.warn(
              `Failed to remove Discord role ${role}: ${removeRoleResponse.status} ${errorBody}`
            )
          } else {
            console.log(`Successfully removed role ${role}`)
          }
        } catch (error) {
          console.error(`Error removing role ${role}:`, error)
        }
      })

    // Perform all removals concurrently
    await Promise.all(rolesToRemovePromises)

    // Assign the new role only if it's not null
    const addRoleResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${DISCORD_GUILD_ID}/members/${userId}/roles/${newRoleId}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
      }
    )

    if (!addRoleResponse.ok) {
      const errorBody = await addRoleResponse.text()
      console.error('Discord API Error:', addRoleResponse.status, errorBody)

      if (addRoleResponse.status === 403) {
        throw new Error(
          'Bot lacks necessary permissions to assign roles. Please check bot permissions in Discord server settings.'
        )
      } else {
        throw new Error(
          `Failed to assign Discord role: ${addRoleResponse.status} ${errorBody}`
        )
      }
    } else {
      console.log('Discord role assigned successfully:', newRoleId)
    }
  } catch (error) {
    console.error('Error assigning Discord role:', error)
    throw error
  }
}

function getRoleIdForTier(tier: string): string | null {
  console.log(`Getting role ID for tier: ${tier}`)
  let roleId: string | null = null

  switch (tier.toLowerCase()) {
    case 'premium subscriber':
      roleId = DISCORD_ROLES.PREMIUM
      break
    case 'subscriber':
      roleId = DISCORD_ROLES.SUBSCRIBER
      break
    case 'supporter':
      roleId = DISCORD_ROLES.SUPPORTER
      break
    default:
      // Free tier, no role assigned
      roleId = null
  }

  console.log(`Role ID for tier ${tier}: ${roleId}`)
  return roleId
}
