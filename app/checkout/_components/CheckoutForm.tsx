'use client';
import {
  AddressElement,
  PaymentElement,
  useCustomCheckout
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { getStatusRedirect } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import PromotionCodeForm from './PromotionCodeForm';
import OrderSummary from './OrderSummary';

export default function CheckoutForm(props: {
  priceWithTrial: boolean;
  daysTrial: number | null;
  userCanTrial: boolean;
}) {
  const { confirm, canConfirm, confirmationRequirements, lineItems, currency } =
    useCustomCheckout();
  const { priceWithTrial, daysTrial, userCanTrial } = props;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  // console.log('lineItems', lineItems);
  // console.log('priceWithTrial', priceWithTrial);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // if can't confirm don't allow form submission
    if (!canConfirm) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);

    //  confirm() method returns a Promise that resolves to an object with one of the following types
    //  { session: CheckoutSession }
    //  { error: StripeError }
    confirm().then((result) => {
      setIsSubmitting(false);
      if (result.session) {
        // router.refresh();
        // router.push(`/?ts=${Date.now()}`);
        setIsSuccess(true);
      } else {
        setMessageBody(result.error.message || 'An error occurred');
      }
    });
  };
  return (
    <div className="flex flex-col gap-16 ">
      {!isSuccess ? (
        <>
          <div className="flex flex-col gap-8">
            <OrderSummary daysTrial={daysTrial} userCanTrial={userCanTrial} />

            <PromotionCodeForm />
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-8"
          >
            <div>
              <h1 className="text-xl font-bold mb-4">Billing information</h1>
              <AddressElement options={{ mode: 'billing' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold  mb-4">Payment information</h1>
              <PaymentElement />
              <div
                id="messages"
                role="alert"
                style={messageBody ? { display: 'block' } : {}}
              >
                {messageBody}
              </div>
            </div>

            <Button
              variant="slim"
              className="w-fit"
              loading={isSubmitting}
              disabled={!canConfirm || isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Processing' : 'Pay'}
            </Button>
          </form>
        </>
      ) : (
        <div>
          <h1 className="text-xl font-bold mb-4">Success</h1>
          <p>Your payment was successful.</p>
          <div className="flex flex-col underline">
            <Link href="/account">Go to account</Link>
            <a
              href="/"
              onClick={(e) => {
                // e.preventDefault();
                // window.location.reload();

                // router.refresh();
                router.push('/');
              }}
            >
              Close
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
