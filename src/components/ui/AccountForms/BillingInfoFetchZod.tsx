import { Tables } from 'types_db'
import BillingInfo from './BillingInfo'
import { stripe } from '@/utils/stripe/config'
import Stripe from 'stripe'

import { z } from 'zod'
import {
  CardDetailsSchema,
  CustomerDataSchema,
  CustomerIdSchema,
  PaymentMethodSchema,
  SubscriptionIdSchema,
  SubscriptionSchema
} from '@/utils/types/zod/types'
import { SubscriptionWithPriceAndProduct } from '@/utils/types'

const PropsSchema = z.object({
  subscription: SubscriptionIdSchema
})

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null
}

export default async function BillingInfoFetchZod({ subscription }: Props) {
  if (!subscription) {
    return null
  }

  let defaultPaymentMethodData = null
  let stripeCustomerId = null

  try {
    // subscription is already validated that it's not null
    // validate the subscription object -> it will check if it has id of type string
    const validatedSubscription = PropsSchema.safeParse({ subscription })

    // use validateSubscription from now on
    if (!validatedSubscription.success) {
      console.error(
        'Couldnt validate subscription.'
        // validatedSubscription.error.issues
      )
      return
    }

    const subscriptionId = validatedSubscription.data.subscription.id

    // fetch the subscription data from stripe and expand the default payment method
    try {
      const existingSubscription = await stripe.subscriptions.retrieve(
        subscriptionId,
        { expand: ['default_payment_method'] }
      )
      if (existingSubscription) {
        const validatedData = SubscriptionSchema.safeParse(existingSubscription)

        // for handling the case the subscription has no default payment method validate data for customer id
        const tryRetrieveCustomerPaymentMethod =
          CustomerIdSchema.safeParse(existingSubscription)

        if (!validatedData.success) {
          console.error(
            'Couldnt retrieve information about subscription from stripe. '
            // validatedData.error.issues
          )

          // if by any chance there is no default payment method, we need to retrieve the customer's default payment method which will be the payment method used for the subscription payments

          if (tryRetrieveCustomerPaymentMethod.success) {
            stripeCustomerId = tryRetrieveCustomerPaymentMethod.data.customer
            const stripeCustomerData =
              await stripe.customers.retrieve(stripeCustomerId)

            const validatedStripeCustomerData =
              CustomerDataSchema.safeParse(stripeCustomerData)
            if (!validatedStripeCustomerData.success) {
              console.error(
                'Couldnt retrieve information about customer from stripe. '
                // validatedStripeCustomerData.error.issues
              )
              return
            }

            console.log('Retrieved backup data')
            const retrieveBackupPaymentMethod =
              await stripe.paymentMethods.retrieve(
                validatedStripeCustomerData.data.invoice_settings
                  .default_payment_method
              )

            const validateRetrievedPaymentMethodData =
              PaymentMethodSchema.safeParse(retrieveBackupPaymentMethod)
            if (!validateRetrievedPaymentMethodData.success) {
              console.error(
                'Couldnt retrieve information about payment method from stripe. '
                // validateRetrievedPaymentMethodData.error.issues
              )
              return
            } else
              defaultPaymentMethodData = validateRetrievedPaymentMethodData.data
          }
        } else if (validatedData.success) {
          stripeCustomerId = validatedData.data.customer
          // if defaultPaymentMethod was set up from the backup customer's object don't assign the info from subscription object because that must have failed before
          if (!defaultPaymentMethodData) {
            defaultPaymentMethodData = validatedData.data.default_payment_method
          }
        }

        // now that we have the subscription data: subscriptionId, stripeCustomerId, defaultPaymentMethodData

        return (
          <div>
            {stripeCustomerId && defaultPaymentMethodData ? (
              <BillingInfo
                subscriptionId={subscriptionId}
                stripeCustomerId={stripeCustomerId}
                userDefaultPaymentMethod={defaultPaymentMethodData}
              />
            ) : (
              <p>No payment data.</p>
            )}
          </div>
        )
      }
    } catch (error) {
      console.error('Error:', error)
      return
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.flatten())
      return null
    } else {
      console.error('Error:', error)
      return null
    }
  }
}
