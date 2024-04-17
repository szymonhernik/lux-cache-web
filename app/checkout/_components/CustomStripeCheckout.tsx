import type { Tables } from '@/types_db';
import { customCheckoutWithStripe } from '@/utils/stripe/server';

import { redirect } from 'next/navigation';
import CustomCheckoutProviderWrapper from './CustomCheckoutProviderWrapper';

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
    return <div>Price not found</div>;
  }
  const { errorRedirect, sessionId, clientSecret } =
    await customCheckoutWithStripe(price, '/');
  if (errorRedirect) {
    return <div>Received Error</div>;
    // redirect('/')
  }
  if (!sessionId && !clientSecret) {
    return <div>Something went wrong</div>;
  }

  if (clientSecret) {
    clientSecretReceived = clientSecret;
  }
  // Check if clientSecretReceived is still not set
  if (!clientSecretReceived) {
    return <div>Client secret not received</div>;
  }

  //for custom checkout provider i'll need to receive the clientsecret from checkoutWithStripe

  return (
    <div>
      <CustomCheckoutProviderWrapper clientSecret={clientSecretReceived} />
    </div>
  );
}
