'server-only'

import { cache } from 'react'
import { stripe } from './config'
import { Stripe } from 'stripe'

export const getSubscriptionDetails = cache(
  async (subscriptionId: string): Promise<Stripe.Subscription> => {
    return await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'discounts']
    })
  }
)
