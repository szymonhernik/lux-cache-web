'use client';

import { getStripe } from '@/utils/stripe/client';
import {
  CustomCheckoutProvider,
  PaymentElement
} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getErrorRedirect } from '@/utils/helpers';
import { redirect } from 'next/navigation';

const stripePromise = getStripe();
export default function CustomCheckoutProviderWrapper(props: {
  clientSecret: string;
}) {
  const { clientSecret } = props;

  if (!clientSecret || !stripePromise) {
    return redirect(
      getErrorRedirect(
        `/`,
        'Invalid payment connection',
        "Sorry, we weren't able to connect to Stripe. Please try again or contact the administrator."
      )
    );
  }

  return (
    <CustomCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </CustomCheckoutProvider>
  );
}
