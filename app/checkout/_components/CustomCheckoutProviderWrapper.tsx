'use client';

import { getStripe } from '@/utils/stripe/client';
import {
  CustomCheckoutProvider,
  PaymentElement
} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = getStripe();
export default function CustomCheckoutProviderWrapper(props: {
  clientSecret: string;
}) {
  const { clientSecret } = props;

  if (!clientSecret || !stripePromise) {
    return <div>Client secret or stripe instance not found</div>;
  }

  return (
    <CustomCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </CustomCheckoutProvider>
  );
}
