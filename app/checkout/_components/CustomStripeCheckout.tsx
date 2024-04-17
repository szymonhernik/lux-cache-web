import type { Tables } from '@/types_db';
import { customCheckoutWithStripe } from '@/utils/stripe/server';

import { redirect } from 'next/navigation';
import CustomCheckoutProviderWrapper from './CustomCheckoutProviderWrapper';
import { getErrorRedirect } from '@/utils/helpers';

type Price = Tables<'prices'>;
type Product = Tables<'products'>;

interface PriceWithProduct extends Price {
  products: Product | null;
}

export default async function CustomStripeCheckout(props: {
  price: PriceWithProduct | null;
}) {
  const { price } = props;
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

  const { errorRedirect, sessionId, clientSecret } =
    await customCheckoutWithStripe(price, '/');
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
        <CustomCheckoutProviderWrapper clientSecret={clientSecretReceived} />
      )}
    </div>
  );
}
