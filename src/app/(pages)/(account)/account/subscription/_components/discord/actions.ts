'use server'

import { createClient } from '@/utils/supabase/server'
import { updateDiscordIntegration } from '@/utils/supabase/admin'
import { getSubscription, getUser } from '@/utils/supabase/queries'

import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { checkRateLimit, checkStrictRateLimit } from '@/utils/upstash/helpers'
import { discordUserSchema, tokenSchema } from '@/utils/types/zod/discord-auth'
import { MemberResponse } from '@/utils/types/discord/types'

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

// Helper functions

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
  const data = await response.json()
  const { id } = discordUserSchema.parse(data)
  return { id } // Return only what we need
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

function getRoleIdForTier(tier: string): string | null {
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

async function assignDiscordRoles(userId: string, tier: string) {
  if (!DISCORD_GUILD_ID) {
    throw new Error('DISCORD_GUILD_ID is not set in environment variables')
  }
  const newRoleId = getRoleIdForTier(tier)
  if (newRoleId === null) {
    console.error('No role ID found for the given tier')
    throw new Error('No role ID found for the given tier')
  }
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
      console.error('Failed to fetch user roles in assignDiscordRoles.')
      throw new Error(`Failed to fetch user roles.`)
    }
    const memberData = (await memberResponse.json()) as MemberResponse

    const currentRoles = memberData.roles

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
    if (newRoleId === null) {
      console.error('No role ID found for the given tier')
      throw new Error('No role ID found for the given tier')
    }
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
      console.log('Discord role assigned successfully')
    }
  } catch (error) {
    console.error('Error assigning Discord role:', error)
    throw error
  }
}

// !!!!! DANGER ZONE !!!!! //
// !!!!! DANGER ZONE !!!!! //
// !!!!! DANGER ZONE !!!!! //
// !!!!! DANGER ZONE !!!!! //
// !!!!! DANGER ZONE !!!!! //
// !!!!! DANGER ZONE !!!!! //
// !!!!! DANGER ZONE !!!!! //
// PUBLIC SERVER ACTIONS BELOW - KEEP THEM SAFE //

// USED!
// ✅ check for authentication
// ✅ add rate limiting to the request
export async function initiateDiscordConnection() {
  // add rate limiting here
  await checkStrictRateLimit('discord:initiate')

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

// USED!
// ✅ check for authentication
export async function connectDiscord(code: string) {
  const supabase = createClient()
  const user = await getUser(supabase)

  if (!user || !user.id) throw new Error('User not authenticated')

  // Step 1: Exchange code for token
  const tokenResponse = await exchangeCodeForToken(code)
  // validate with zod the tokenResponse is valid
  const validatedToken = tokenSchema.parse(tokenResponse)

  // Step 2: Get user's discord id
  const { id: discordUserId } = await getDiscordUserInfo(
    validatedToken.access_token
  )
  // Step 3: Add user to Discord server
  await addUserToDiscordServer(discordUserId, validatedToken.access_token)

  // Step 4: Get user's subscription and assign roles
  const subscription = await getSubscription(supabase)
  if (subscription?.prices?.products?.name) {
    await assignDiscordRoles(discordUserId, subscription.prices.products.name)
  }
  // Step 5: Update Discord integration status in the database
  // it's a supabase admin function that updates the discord_integration table
  await updateDiscordIntegration(user.id, {
    connection_status: true,
    discord_id: discordUserId,
    connected_at: new Date().toISOString()
  })
}
