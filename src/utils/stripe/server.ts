// import 'server-only';
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
import { Tables } from 'types_db'
import { z } from 'zod'
import { CheckoutResponse, Price, PriceWithProduct } from '../types'
import {
  ProductMetadataSchema,
  SubscriptionItemSchema
} from '../types/zod/types'

export async function retrievePaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId)
    // console.log('Payment methods from server stripe', paymentMethods);
    return paymentMethods.data
  } catch (error) {
    console.error(error)
    throw new Error('Could not retrieve payment methods.')
  }
}
export async function detachPaymentMethod(
  paymentMethodId: string,
  redirectPath: string = '/account'
) {
  try {
    const detach = await stripe.paymentMethods.detach(paymentMethodId)
    // TODO: Check if this is enough to be sure the payment method was detached
    if (detach) {
      // console.log('Detach returns: ', detach);

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

export async function updateSubscriptionPlan(
  subscriptionId: string,
  newPriceId: string,
  redirectPath: string = '/account'
) {
  try {
    const existingSubscriptionItems = await stripe.subscriptionItems.list({
      limit: 3,
      subscription: subscriptionId
    })

    const validatedSubscriptionItemId = SubscriptionItemSchema.safeParse(
      existingSubscriptionItems.data[0]
    )
    if (!validatedSubscriptionItemId.success) {
      // console.error(validatedSubscriptionItemId.error.issues);

      return getErrorRedirect(
        redirectPath,
        "We couldn't find the subscription.",
        'Please try again later or contact a system administrator.'
      )
    } else {
      try {
        const updatedSubscriptionItem = await stripe.subscriptionItems.update(
          validatedSubscriptionItemId.data.id,
          {
            price: newPriceId,
            // Always invoice immediately for prorations.
            proration_behavior: 'always_invoice',
            // Stripe returns an HTTP 402 status code if a subscription’s invoice cannot be paid
            payment_behavior: 'error_if_incomplete'
          }
        )
        if (updatedSubscriptionItem) {
          // console.log(
          //   'updatedSubscriptionItem return data',
          //   updatedSubscriptionItem
          // );

          return getStatusRedirect(
            redirectPath,
            'Success!',
            'Your subscription has been updated.'
          )
        }
      } catch (errors) {
        console.log('Errors while updating subscription:', errors)

        return getErrorRedirect(
          redirectPath,
          "We couldn't update your subscription.",
          'Check your balance or try again with a different payment method.'
        )
      }
    }

    return console.log('process')
    // return getStatusRedirect(
    //   redirectPath,
    //   'Success!',
    //   'Your subscription has been updated.'
    // );
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

export async function updateSubscriptionDefaultPaymentMethod(
  defaultPaymentMethodId: string,
  subscriptionId: string,
  redirectPath: string = '/account'
) {
  // Create a checkout session in Stripe
  try {
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
      // console.log('redirectPath', redirectPath);
    } else {
      // throw new Error(
      //   'Unable to update the payment method for your subscription.'
      // );
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

export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = '/account'
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient()
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.error(error)
      throw new Error('Could not get user session.')
    }

    // Retrieve or create the customer in Stripe
    let customer: string
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      })
    } catch (err) {
      console.error(err)
      throw new Error('Unable to access customer record.')
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto'
      },
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath)
    }

    console.log(
      'Trial end:',
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    )
    if (price.type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
        }
      }
    } else if (price.type === 'one_time') {
      params = {
        ...params,
        mode: 'payment'
      }
    }

    // Create a checkout session in Stripe
    let session
    try {
      session = await stripe.checkout.sessions.create(params)
    } catch (err) {
      console.error(err)
      throw new Error('Unable to create checkout session.')
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id }
    } else {
      throw new Error('Unable to create checkout session.')
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
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

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = createClient()
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      if (error) {
        console.error(error)
      }
      throw new Error('Could not get user session.')
    }

    let customer
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      })
    } catch (err) {
      console.error(err)
      throw new Error('Unable to access customer record.')
    }

    if (!customer) {
      throw new Error('Could not get customer.')
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account')
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
  clientSecret?: string | null // Add this line
}
export async function updatePaymentMethod(
  customerId: string,
  subscriptionId: string,
  redirectPath: string = '/account'
): Promise<CustomCheckoutResponse> {
  // I'll need:
  // - customer ID
  // - subscription ID

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

export async function customCheckoutWithStripe(
  price: PriceWithProduct,
  redirectPath: string = '/',
  userCanTrial: boolean
): Promise<CustomCheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient()
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.error(error)
      throw new Error('Could not get user session.')
    }

    // Retrieve or create the customer in Stripe
    let customer: string
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      })
    } catch (err) {
      console.error(err)
      throw new Error('Unable to access customer record.')
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto'
      },
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      // @ts-ignore
      ui_mode: 'custom',
      return_url: 'http://localhost:3000/'
    }

    console.log(
      'Trial end:',
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    )

    const readMetadata = ProductMetadataSchema.safeParse(
      price?.products?.metadata
    )
    let priceHasTrial = false
    if (readMetadata.success) {
      priceHasTrial =
        readMetadata.data.trial_allowed === 'true' &&
        readMetadata.data.index === '0'
    }
    if (price.type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription'
      }
      if (priceHasTrial && userCanTrial) {
        params = {
          ...params,
          subscription_data: {
            trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
          }
        }
      }
    } else if (price.type === 'one_time') {
      params = {
        ...params,
        mode: 'payment'
      }
    }

    // console.log('Params:', params);

    // Create a checkout session in Stripe
    let session
    try {
      session = await stripe.checkout.sessions.create(params)
    } catch (err) {
      console.error(err)
      throw new Error('Unable to create checkout session.')
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      // console.log('Session:', session);

      return { sessionId: session.id, clientSecret: session.client_secret }
    } else {
      throw new Error('Unable to create checkout session.')
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
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
