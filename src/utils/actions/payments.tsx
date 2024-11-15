'use server'

import { isAuthenticated } from '../data/auth'
import { checkRateLimit } from '../upstash/helpers'
import Stripe from 'stripe'
import { getUser } from '../supabase/queries'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const isEmbeddedCheckoutEnabled =
  process.env.NEXT_PUBLIC_STRIPE_EMBEDDED_CHECKOUT_ENABLED === 'true'

export const checkoutAction = async (formData: FormData) => {
  // await checkRateLimit('checkout')
  const supabase = createClient()
  const user = await getUser(supabase)

  if (!user) {
    const priceId = formData.get('priceId') as string
    redirect(`/signin/signup?redirect=pricing&priceId=${priceId}`)
  }

  const priceId = formData.get('priceId') as string

  const createCheckoutSessionObject: Stripe.Checkout.SessionCreateParams =
    isEmbeddedCheckoutEnabled
      ? {
          ui_mode: 'embedded',
          payment_method_types: ['card'],
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
            trial_period_days: 14
          },
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`
        }
      : {
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1
            }
          ],
          mode: 'subscription',
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
          client_reference_id: user.id.toString(),
          allow_promotion_codes: true,
          subscription_data: {
            trial_period_days: 14
          }
        }

  const session = await stripe.checkout.sessions.create(
    createCheckoutSessionObject
  )

  if (!isEmbeddedCheckoutEnabled && session.url) {
    redirect(session.url)
  }

  return session.client_secret
}
