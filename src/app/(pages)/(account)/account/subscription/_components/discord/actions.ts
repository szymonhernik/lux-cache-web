'use server'

import { createClient } from '@/utils/supabase/server'
import {
  getDiscordIntegration,
  updateDiscordIntegration
} from '@/utils/supabase/admin'
import { getSubscription } from '@/utils/supabase/queries'
import { cache } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/discord`
const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10'
const DISCORD_BOT_PERMISSIONS = process.env.DISCORD_BOT_PERMISSIONS!

// TODO:
// make sure if the dicord account is already in the server that you don't try to add them again
// don't add to supabase db if assigning roles fails
// keep discord role in sync with user's subscription status (webhooks?)

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

export async function disconnectDiscord(userId: string) {
  const supabase = createClient()
  const { error, data } = await supabase
    .from('discord_integration')
    .update({
      connection_status: false,
      discord_id: null,
      connected_at: null
    })
    .eq('user_id', userId)
    .select()
  if (error) {
    console.error('Error updating Discord integration:', error)
    throw new Error('Failed to update Discord integration')
  }

  if (!data) {
    console.error('No record found to update')
    throw new Error('No record found to update')
  }
  if (data.length === 1 && data[0].connection_status === false) {
    console.log('Discord integration updated. user disconnected')
  }

  // TODO: Implement Discord API call to remove user from server or roles
}

export async function initiateDiscordConnection() {
  const scope = 'identify guilds.join'

  return `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${DISCORD_BOT_PERMISSIONS}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`
}

export async function connectDiscord(code: string) {
  const supabase = createClient() // Create a Supabase client instance
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser() // Get the authenticated user

  if (userError || !user) throw new Error('User not authenticated') // Throw an error if the user is not authenticated

  try {
    const tokenResponse = await exchangeCodeForToken(code) // Exchange the authorization code for an access token
    const discordUser = await getDiscordUserInfo(tokenResponse.access_token) // Get the Discord user info using the access token

    await addUserToDiscordServer(discordUser.id, tokenResponse.access_token) // Add the user to the Discord server

    const subscription = await getSubscription(supabase) // Get the user's subscription details
    if (subscription?.prices?.products?.name) {
      await assignDiscordRoles(
        discordUser.id,
        subscription.prices.products.name
      ) // Assign Discord roles based on the user's subscription tier
    }

    // Update the Discord integration status in the database only if the above operations succeed
    await updateDiscordIntegration(user.id, {
      connection_status: true,
      discord_id: discordUser.id,
      connected_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in connectDiscord:', error) // Log any errors that occur
    throw error // Rethrow the error to be handled by the caller
  }
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
  const guildId = process.env.DISCORD_GUILD_ID!
  const roleId = getRoleIdForTier(tier)
  const rolesToRemove = [
    process.env.DISCORD_SUPPORTER_ROLE_ID!,
    process.env.DISCORD_SUBSCRIBER_ROLE_ID!,
    process.env.DISCORD_PREMIUM_ROLE_ID!
  ]

  try {
    // Fetch current roles of the user
    const memberResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${guildId}/members/${userId}`,
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

    console.log('currentRoles:', currentRoles)
    //TODO: i think here we should remove all roles
    // Remove specified roles if they exist
    for (const role of rolesToRemove) {
      if (currentRoles.includes(role)) {
        const removeRoleResponse = await fetch(
          `${DISCORD_API_ENDPOINT}/guilds/${guildId}/members/${userId}/roles/${role}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
          }
        )

        if (!removeRoleResponse.ok) {
          const errorBody = await removeRoleResponse.text()
          console.error(
            'Discord API Error:',
            removeRoleResponse.status,
            errorBody
          )
          throw new Error(
            `Failed to remove Discord role: ${removeRoleResponse.status} ${errorBody}`
          )
        }
        console.log('Removed role:', role)
      }
    }
    // TODO: and here we should add the new role and all the lower tiers
    // Assign the new role
    const response = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
      }
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Discord API Error:', response.status, errorBody)

      if (response.status === 403) {
        throw new Error(
          'Bot lacks necessary permissions to assign roles. Please check bot permissions in Discord server settings.'
        )
      } else {
        throw new Error(
          `Failed to assign Discord role: ${response.status} ${errorBody}`
        )
      }
    } else {
      console.log('Discord role assigned successfully')
      console.log('New role:', roleId)
    }
  } catch (error) {
    console.error('Error assigning Discord role:', error)
    throw error
  }
}

function getRoleIdForTier(tier: string): string {
  console.log(`Getting role ID for tier: ${tier}`)
  let roleId: string
  switch (tier.toLowerCase()) {
    case 'premium subscriber':
      roleId = process.env.DISCORD_PREMIUM_ROLE_ID!
      break
    case 'subscriber':
      roleId = process.env.DISCORD_PRO_ROLE_ID!
      break
    //   TODO: change defualt to free (no tier)
    default:
      roleId = process.env.DISCORD_BASIC_ROLE_ID!
  }
  console.log(`Role ID for tier ${tier}: ${roleId}`)
  return roleId
}
