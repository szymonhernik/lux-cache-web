'use server'

import Stripe from 'stripe'
import { stripe } from '@/utils/stripe/config'
import { createClient } from '@/utils/supabase/server'
import { createOrRetrieveCustomer } from '@/utils/supabase/admin'
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp,
  getStatusRedirect
} from '@/utils/helpers'
import { PriceWithProduct } from '../types'
import { ProductMetadataSchema } from '../types/zod/types'

import {
  getCustomer,
  getSubscriptionDetails,
  getUser
} from '../supabase/queries'
import {
  checkLenientRateLimit,
  checkRateLimit,
  checkStrictRateLimit
} from '../upstash/helpers'

async function validateCustomerOwnership() {
  const supabase = createClient()
  const user = await getUser(supabase)
  if (!user) {
    throw new Error('You must be signed in to perform this action')
  }
  const customer = (await getCustomer(supabase)) as {
    id: string
    stripe_customer_id: string
  }

  // Verifies the customerId belongs to the authenticated user
  if (!customer || !customer.stripe_customer_id) {
    throw new Error('You are not authorized to perform this action')
  }
  return customer.stripe_customer_id
}

// USED!
// ✅ add rate limitting to the request
// ✅ check for authentication
export async function retrievePaymentMethods(customerId: string) {
  await checkLenientRateLimit('retrievePaymentMethods')

  await validateCustomerOwnership()

  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId)
    return paymentMethods.data
  } catch (error) {
    console.error(error)
    throw new Error('Could not retrieve payment methods.')
  }
}
// USED!
// ✅ check for authentication
// ✅ add rate limitting to the request
export async function detachPaymentMethod(
  paymentMethodId: string,
  redirectPath: string = '/account'
) {
  try {
    await checkLenientRateLimit('detachPaymentMethod')
  } catch (error) {
    return getErrorRedirect(
      redirectPath,
      'Rate limit exceeded',
      'Please try again later or contact a system administrator.'
    )
  }
  try {
    await validateCustomerOwnership()
    const detach = await stripe.paymentMethods.detach(paymentMethodId)
    if (detach) {
      return getStatusRedirect(
        redirectPath,
        'Success!',
        'Your card has been removed.'
      )
    } else {
      return getErrorRedirect(
        redirectPath,
        'Unable to detach payment method.',
        'Please try again later or contact a system administrator.'
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return getErrorRedirect(
        redirectPath,
        error.message,
        'Please try again later or contact a system administrator.'
      )
    } else {
      return getErrorRedirect(
        redirectPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      )
    }
  }
}

// USED!
// ✅ rate limit the request
// ✅ check for authentication
export async function updateSubscription(
  subscriptionId: string,
  redirectPath: string = '/redirect?url=/account',
  action: string
) {
  try {
    await checkLenientRateLimit('updateSubscription')
  } catch (error) {
    return getErrorRedirect(
      redirectPath,
      'Rate limit exceeded',
      'Please try again later or contact a system administrator.'
    )
  }

  try {
    // First, get the subscription to find the customer ID
    const subscription = await getSubscriptionDetails(subscriptionId)

    // Verify ownership using the existing helper function
    await validateCustomerOwnership()

    // Proceed with the subscription update
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end:
          action === 'cancel' ? true : action === 'renew' ? false : true
      }
    )

    if (updatedSubscription) {
      return getStatusRedirect(
        redirectPath,
        'Success!',
        'Your subscription has been updated.'
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return getErrorRedirect(
        redirectPath,
        error.message,
        'Please try again later or contact a system administrator.'
      )
    } else {
      return getErrorRedirect(
        redirectPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      )
    }
  }
}

// USED!
// ✅ rate limit the request
// ✅ check for authentication
export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string,
  redirectPath: string = '/redirect?url=/account/subscription'
) {
  try {
    // rate limit (5 requests per minute)
    await checkStrictRateLimit('updateSubscriptionPlan')
    // verify ownership
    const subscription = await getSubscriptionDetails(subscriptionId)
    await validateCustomerOwnership()

    try {
      const updatedSubscription = await stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              price: newPriceId,
              id: subscription.items.data[0].id
            }
          ],
          proration_behavior: 'always_invoice',
          payment_behavior: 'error_if_incomplete'
        }
      )

      if (updatedSubscription) {
        return getStatusRedirect(
          redirectPath,
          'Success!',
          'Your subscription has been updated.'
        )
      }
    } catch (error) {
      // Changed from errors to error
      console.log('Error while updating subscription:', error)
      return getErrorRedirect(
        redirectPath,
        "We couldn't update your subscription.",
        'Check your balance or try again with a different payment method.'
      )
    }
  } catch (error) {
    // This was already error
    if (error instanceof Error) {
      return getErrorRedirect(
        redirectPath,
        error.message,
        'Please try again later or contact a system administrator.'
      )
    } else {
      return getErrorRedirect(
        redirectPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      )
    }
  }
}

// USED!
// ✅ rate limit the request
// ✅ check for authentication
export async function updateSubscriptionDefaultPaymentMethod(
  defaultPaymentMethodId: string,
  subscriptionId: string,
  redirectPath: string = '/account/subscription'
) {
  try {
    // rate limit (10 requests per minute)
    await checkRateLimit('updateSubscriptionDefaultPaymentMethod')
    // verify ownership
    await validateCustomerOwnership()
    const newSubscriptionPaymentMethod = await stripe.subscriptions.update(
      subscriptionId,
      {
        default_payment_method: defaultPaymentMethodId
      }
    )

    if (newSubscriptionPaymentMethod) {
      // return true;
      return getStatusRedirect(
        redirectPath,
        'Success!',
        'Your payment method has been correctly updated.'
      )
    } else {
      return getErrorRedirect(
        redirectPath,
        'Unable to update the payment method for your subscription.',
        'Please try again later or contact a system administrator.'
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      return getErrorRedirect(
        redirectPath,
        error.message,
        'Please try again later or contact a system administrator.'
      )
    } else {
      return getErrorRedirect(
        redirectPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      )
    }
  }
}

// USED IN ACCOUNT/SUBSCRIPTION
// ✅ rate limit the request
// ✅ check for authentication
export async function createStripePortal(currentPath: string) {
  try {
    // rate limit default (10 requests per minute)
    await checkRateLimit('createStripePortal')
    const supabase = createClient()
    const user = await getUser(supabase)

    if (!user) {
      throw new Error('Could not get user session.')
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

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account/subscription')
      })
      if (!url) {
        throw new Error('Could not create billing portal')
      }
      return url
    } catch (err) {
      console.error(err)
      throw new Error('Could not create billing portal')
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.'
      )
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      )
    }
  }
}
type CustomCheckoutResponse = {
  sessionId?: string
  errorRedirect?: string
  clientSecret?: string | null
}

// USED IN UpdatePaymentMethod in ACCOUNT/SUBSCRIPTION
// ✅ rate limit the request
// ✅ check for authentication
export async function createSetupSession(
  subscriptionId: string,
  redirectPath: string = '/account'
): Promise<CustomCheckoutResponse> {
  // rate limit default (100 requests per minute)
  await checkLenientRateLimit('updatePaymentMethod')
  const customerId = await validateCustomerOwnership()
  let params: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    mode: 'setup',
    customer: customerId,
    setup_intent_data: {
      metadata: {
        customer_id: customerId,
        subscription_id: subscriptionId
      }
    },
    // @ts-ignore
    ui_mode: 'custom',
    return_url: getURL(redirectPath)
  }

  try {
    let session
    try {
      if (customerId && subscriptionId) {
        session = await stripe.checkout.sessions.create(params)
      } else {
        throw new Error(
          'Unable to create checkout session. Missing customer or subscription data'
        )
      }
    } catch (err) {
      console.error(err)
      throw new Error('Unable to create checkout session.')
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { clientSecret: session.client_secret }
    } else {
      throw new Error('Unable to create checkout session.')
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          err.message,
          'Please try again later or contact a system administrator.'
        )
      }
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      }
    }
  }
}

// USED!
// ✅ rate limit the request
// ✅ check for authentication
export async function customCheckoutWithStripe(
  price: PriceWithProduct,
  redirectPath: string = '/',
  userCanTrial: boolean
): Promise<CustomCheckoutResponse> {
  try {
    // Rate limit check
    try {
      await checkLenientRateLimit('customCheckoutWithStripe')
    } catch (error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'Rate limit exceeded',
          'Please try again later.'
        )
      }
    }

    // Auth check
    const supabase = createClient()
    const user = await getUser(supabase)
    if (!user) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'Authentication required',
          'Please sign in to continue.'
        )
      }
    }

    // Customer creation/retrieval
    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email || ''
    }).catch(() => null)

    if (!customer) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'Customer creation failed',
          'Unable to process checkout. Please try again.'
        )
      }
    }

    // Build session parameters
    const params = buildCheckoutParams({
      price,
      customer,
      userCanTrial
    })

    // Create checkout session
    const session = await stripe.checkout.sessions
      .create(params)
      .catch((error) => {
        console.error('Stripe session creation error:', error)
        return null
      })

    if (!session) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'Checkout creation failed',
          'Unable to initialize checkout. Please try again.'
        )
      }
    }

    return {
      sessionId: session.id,
      clientSecret: session.client_secret
    }
  } catch (error) {
    console.error('Unexpected error in customCheckoutWithStripe:', error)
    return {
      errorRedirect: getErrorRedirect(
        redirectPath,
        'An unexpected error occurred',
        'Please try again later or contact support.'
      )
    }
  }
}

// Helper function to build checkout params
function buildCheckoutParams({
  price,
  customer,
  userCanTrial
}: {
  price: PriceWithProduct
  customer: string
  userCanTrial: boolean
}): Stripe.Checkout.SessionCreateParams {
  const baseParams: Stripe.Checkout.SessionCreateParams = {
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer,
    customer_update: { address: 'auto' },
    line_items: [{ price: price.id, quantity: 1 }],
    ui_mode: 'custom' as any,
    return_url: getURL()
  }

  const readMetadata = ProductMetadataSchema.safeParse(
    price?.products?.metadata
  )
  const priceHasTrial =
    readMetadata.success &&
    readMetadata.data.trial_allowed === 'true' &&
    readMetadata.data.index === '0'

  if (price.type === 'recurring') {
    return {
      ...baseParams,
      mode: 'subscription',
      ...(priceHasTrial && userCanTrial
        ? {
            subscription_data: {
              trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
            }
          }
        : {})
    }
  }

  return {
    ...baseParams,
    mode: 'payment'
  }
}
