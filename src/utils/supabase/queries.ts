'server-only'

import { SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'
import { ProductWithPrices, SubscriptionWithPriceAndProduct } from '../types'
import { redirect } from 'next/navigation'
import { Tables } from 'types_db'
import { getErrorRedirect } from '../helpers'
import subscriptionTiers, { SubscriptionTiers } from '../stripe/products'
import { unstable_cache } from 'next/cache'
import { stripe } from '@/utils/stripe/config'

type User = Tables<'users'>
export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  return user
})
export const getCustomer = cache(async (supabase: SupabaseClient) => {
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .maybeSingle()
  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }
  return customer
})

// Cached wrapper function
export const getSubscriptionDetails = cache(async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId)
})

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle()
  if (error) {
    console.error('Error fetching subscription:', error)
  }

  return subscription as SubscriptionWithPriceAndProduct
})
export const getUserTier = cache(async (supabase: SupabaseClient) => {
  const subscription = await getSubscription(supabase)

  if (!subscription?.prices?.products) {
    return { userTier: 0, productName: 'free' }
  }

  const productId = subscription.prices.products.id
  const productName = subscription.prices.products.name
  const userTier = (subscriptionTiers as SubscriptionTiers)[productId] ?? 0

  return { userTier, productName }
})

export const getUserRoles = cache(async (supabase: SupabaseClient) => {
  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select('role')

  if (error) {
    console.error('Error fetching user roles:', error)
  }

  // Return array of roles or empty array if none found
  return userRoles?.map((ur) => ur.role as string) || []
})

// export const getProducts = cache(async (supabase: SupabaseClient) => {
//   const { data: products, error } = await supabase
//     .from('products')
//     .select('*, prices(*)')
//     .eq('active', true)
//     .eq('prices.active', true)
//     .order('metadata->index')
//     .order('unit_amount', { referencedTable: 'prices' })
//   if (error) {
//     console.error('Error fetching products:', error)
//   }

//   return products as ProductWithPrices[]
// })

export const getCachedProducts = async (supabase: SupabaseClient) => {
  return unstable_cache(
    async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*, prices(*)')
        .eq('active', true)
        .eq('prices.active', true)
        .order('metadata->index')
        .order('unit_amount', { referencedTable: 'prices' })
      if (error) {
        console.error('Error fetching products:', error)
      }

      return products as ProductWithPrices[]
    },
    ['products-cache-v2'],
    { tags: ['products'] }
  )()
}

export const getCanTrial = cache(async (supabase: SupabaseClient) => {
  const { data: userCanTrial } = await supabase
    .from('users')
    .select('can_trial')
    .single()
  return userCanTrial as { can_trial: boolean }
})

// export const getUserData = cache(async (supabase: SupabaseClient) => {
//   const { data: userData } = await supabase
//     .from('users')
//     .select('full_name')
//     .single()
//   return userData as { full_name: string }
// })

// get price and product info from stripe based on the price id
// TODO: verify what exactly needs to be selected from the database
export const getPrice = cache(
  async (supabase: SupabaseClient, priceId: string) => {
    const { data: price, error } = await supabase
      .from('prices')
      .select('*, products(*)')
      .eq('active', true)
      .eq('id', priceId)
      .eq('products.active', true)
      .maybeSingle()

    if (error || !price) {
      return redirect(
        getErrorRedirect(
          `/`,
          'Plan that you chose was not found',
          'Please choose one of the available plans.'
        )
      )
    }
    return price
  }
)

export const getBookmarks = cache(async (supabase: SupabaseClient) => {
  return await supabase.from('bookmarks').select('post_id, created_at')
})

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
