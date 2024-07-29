import { SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'
import {
  ProductWithPrices,
  Subscription,
  SubscriptionWithPriceAndProduct
} from '../types'
import { redirect } from 'next/navigation'
import { Tables } from 'types_db'
import { getErrorRedirect } from '../helpers'
import subscriptionTiers, { SubscriptionTiers } from '../stripe/products'

type User = Tables<'users'>
export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  return user
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
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle()

  if (error) {
    console.error('Error fetching subscription:', error)
    return { userTier: 0, productName: 'free' }
  }

  if (subscription) {
    const productId = subscription.prices.products.id
    const productName = subscription.prices.products.name
    const userTier = (subscriptionTiers as SubscriptionTiers)[productId] ?? 0 // Default to Free (0) if not found

    return { userTier, productName }
  }

  return { userTier: 0, productName: 'free' } // No subscription, hence Free tier
})

export const getProducts = cache(async (supabase: SupabaseClient) => {
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
})

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single()
  return userDetails as User
})

// get price and product info from stripe based on the price id
export const getPrice = cache(
  async (supabase: SupabaseClient, priceId: string) => {
    const { data: price, error } = await supabase
      .from('prices')
      .select('*, products(*)')
      .eq('active', true)
      .eq('id', priceId)
      .eq('products.active', true)
      .maybeSingle()

    console.log('priceId', priceId)
    console.log('price', price)

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
