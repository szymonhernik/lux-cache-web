'use server'

import { isAuthenticated } from '../data/auth'
import { checkRateLimit } from '../upstash/helpers'
import Stripe from 'stripe'
import { getCanTrial, getUser } from '../supabase/queries'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createOrRetrieveCustomer } from '../supabase/admin'
import { getStatusRedirect } from '../helpers'
import { createTrialToPaidSchedule } from '../stripe/subscription-schedules'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const isEmbeddedCheckoutEnabled =
  process.env.NEXT_PUBLIC_STRIPE_EMBEDDED_CHECKOUT_ENABLED === 'true'

// Helper function to get price amount
async function getPriceAmount(priceId: string): Promise<number> {
  const price = await stripe.prices.retrieve(priceId)
  return price.unit_amount || 0
}

export const checkoutAction = async (formData: FormData) => {
  await checkRateLimit('checkout')
  const supabase = createClient()
  const user = await getUser(supabase)

  if (!user) {
    const priceId = formData.get('priceId') as string
    redirect(`/signin/signup?redirect=pricing&priceId=${priceId}`)
  }

  let customer
  try {
    customer = await createOrRetrieveCustomer({
      uuid: user.id || '',
      email: user.email || ''
    })
  } catch (err) {
    console.error('Error while creating or retrieving customer:', err)
    throw new Error('Unable to access customer record.')
  }

  if (!customer) {
    console.error('Could not get customer.')
    throw new Error('Could not get customer.')
  }

  const priceId = formData.get('priceId') as string
  const price = await stripe.prices.retrieve(priceId, {
    expand: ['product']
  })

  const product = price.product as Stripe.Product
  const isTrialAllowed = product.metadata.trial_allowed === 'true'
  const canUserTrial = isTrialAllowed
    ? (await getCanTrial(supabase)).can_trial
    : false

  // For trial products, use the target paid price directly with trial period
  if (isTrialAllowed && canUserTrial && price.unit_amount === 0) {
    const targetPaidPriceId = formData.get('targetPaidPriceId') as string

    if (!targetPaidPriceId) {
      throw new Error(
        'Target paid price ID is required for trial subscriptions'
      )
    }

    // Use the trial price ($0) and schedule conversion to paid later
    const createCheckoutSessionObject: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      customer,
      line_items: [
        {
          price: priceId, // Trial price ($0) - gives limited access
          quantity: 1
        }
      ],
      mode: 'subscription',
      client_reference_id: user.id.toString(),
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7
      },
      metadata: {
        trial_to_paid_price_id: targetPaidPriceId,
        user_id: user.id
      },
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/new-subscriber?session_id={CHECKOUT_SESSION_ID}`
    }

    const session = await stripe.checkout.sessions.create(
      createCheckoutSessionObject
    )

    if (!isEmbeddedCheckoutEnabled && session.url) {
      redirect(session.url)
    }

    return session.client_secret
  }

  // Regular checkout for paid plans
  const createCheckoutSessionObject: Stripe.Checkout.SessionCreateParams = {
    ui_mode: 'embedded',
    customer,
    // payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    client_reference_id: user.id.toString(),
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: isTrialAllowed && canUserTrial ? 7 : undefined
    },
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/new-subscriber?session_id={CHECKOUT_SESSION_ID}`
  }

  const session = await stripe.checkout.sessions.create(
    createCheckoutSessionObject
  )

  if (!isEmbeddedCheckoutEnabled && session.url) {
    redirect(session.url)
  }

  return session.client_secret
}
