import type { Tables } from '@/types_db';
import { customCheckoutWithStripe } from '@/utils/stripe/server';

import { redirect } from 'next/navigation';
import CustomCheckoutProviderWrapper from './CustomCheckoutProviderWrapper';
import { getErrorRedirect } from '@/utils/helpers';
import { z } from 'zod';
import { ProductMetadataSchema } from '@/utils/types/zod/types';

type Price = Tables<'prices'>;
type Product = Tables<'products'>;

interface PriceWithProduct extends Price {
  products: Product | null;
}

export default async function CustomStripeCheckout(props: {
  price: PriceWithProduct | null;
  userDetails: { can_trial: boolean } | null;
}) {
  const { price, userDetails } = props;
  let clientSecretReceived: string | null = null;
  if (!price) {
    return redirect(
      getErrorRedirect(
        `/`,
        'Plan not found',
        'Please choose one of the available plans.'
      )
    );
  }

  // If we can't read the user's information about the trial, we default to false
  // TODO: This case could be handled better (e.g. give the user information why they can't trial)
  const userCanTrial = userDetails?.can_trial ?? false;

  const readMetadata = ProductMetadataSchema.safeParse(
    price?.products?.metadata
  );
  let priceWithTrial: boolean = false;
  let daysTrial: number | null = null;
  if (readMetadata.success) {
    // console.log('readMetadata', readMetadata.data);
    priceWithTrial =
      readMetadata.data.trial_allowed === 'true' &&
      readMetadata.data.index === '0';

    daysTrial = price.trial_period_days;
  }

  // check if the user can trial, if not reasign the values to false and null
  // ! this will not prevent the user from trial
  // priceWithTrial and daysTrial are used for the order summary in the checkout form
  // if (userDetails && !userCanTrial) {
  //   priceWithTrial = false;
  //   daysTrial = null;
  // }

  const { errorRedirect, sessionId, clientSecret } =
    await customCheckoutWithStripe(price, '/', userCanTrial);
  if (errorRedirect) {
    return redirect(errorRedirect);
  }
  //for custom checkout provider i'll need to receive the clientsecret from checkoutWithStripe
  if (!sessionId && !clientSecret) {
    return redirect(
      getErrorRedirect(
        `/`,
        'Invalid session',
        "Sorry, we weren't able to connect to Stripe. Please try again."
      )
    );
  }
  if (clientSecret) {
    clientSecretReceived = clientSecret;
  }

  return (
    <div>
      {clientSecretReceived && (
        <CustomCheckoutProviderWrapper
          clientSecret={clientSecretReceived}
          priceWithTrial={priceWithTrial}
          daysTrial={daysTrial}
          userCanTrial={userCanTrial}
        />
      )}
    </div>
  );
}
