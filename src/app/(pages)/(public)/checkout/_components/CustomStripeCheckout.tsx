import type { Tables } from 'types_db'
import { customCheckoutWithStripe } from '@/utils/stripe/server'

import { redirect } from 'next/navigation'
import CustomCheckoutProviderWrapper from './CustomCheckoutProviderWrapper'
import { getErrorRedirect } from '@/utils/helpers'
import { ProductMetadataSchema } from '@/utils/types/zod/types'

type Price = Tables<'prices'>
type Product = Tables<'products'>

interface PriceWithProduct extends Price {
  products: Product | null
}

export default async function CustomStripeCheckout(props: {
  price: PriceWithProduct | null
  userCanTrial: { can_trial: boolean } | null
}) {
  const { price, userCanTrial } = props

  if (!price) {
    return redirect(
      getErrorRedirect(
        `/`,
        'Plan not found',
        'Please choose one of the available plans.'
      )
    )
  }

  // If we can't read the user's information about the trial, we default to false
  // TODO: This case could be handled better (e.g. give the user information why they can't trial)
  const userCanTrialBoolean = userCanTrial?.can_trial ?? false

  // Parse metadata and trial info
  const readMetadata = ProductMetadataSchema.safeParse(
    price?.products?.metadata
  )
  const priceWithTrial = readMetadata.success
    ? readMetadata.data.trial_allowed === 'true' &&
      readMetadata.data.index === '0'
    : false
  const daysTrial = readMetadata.success ? price.trial_period_days : null

  // check if the user can trial, if not reasign the values to false and null
  // ! this will not prevent the user from trial
  // priceWithTrial and daysTrial are used for the order summary in the checkout form
  // if (userCanTrial && !userCanTrial) {
  //   priceWithTrial = false;
  //   daysTrial = null;
  // }

  const { errorRedirect, sessionId, clientSecret } =
    await customCheckoutWithStripe(price, '/', userCanTrialBoolean)
  if (errorRedirect) {
    return redirect(errorRedirect)
  }
  //for custom checkout provider i'll need to receive the clientsecret from checkoutWithStripe
  if (!sessionId || !clientSecret) {
    return redirect(
      getErrorRedirect(
        `/`,
        'Invalid session',
        "Sorry, we weren't able to connect to Stripe. Please try again."
      )
    )
  }

  return (
    <div>
      {clientSecret && (
        <CustomCheckoutProviderWrapper
          clientSecret={clientSecret}
          priceWithTrial={priceWithTrial}
          daysTrial={daysTrial}
          userCanTrial={userCanTrialBoolean}
        />
      )}
    </div>
  )
}
