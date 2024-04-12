'use client';

import Button from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  createStripePortal,
  retrievePaymentMethods
} from '@/utils/stripe/server';
import Card from '@/components/ui/Card';
import Stripe from 'stripe';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import DisplayPaymentData from './DisplayPaymentData';

interface PaymentMethodDetails {
  last4: string;
  display_brand: string;
  exp_year: number;
  exp_month: number;
  // Add more specific fields as necessary
}

interface Props {
  //   userDefaultPaymentMethod: Stripe.PaymentMethod | null;
  //   userDefaultPaymentMethod: PaymentMethodDetails | null;
  userDefaultPaymentMethod: any;
  stripeCustomerId: any;
  subscriptionId: any;
}

export default function BillingInfo({
  userDefaultPaymentMethod,
  stripeCustomerId,
  subscriptionId
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]); // State to store payment methods

  // Ensure `userDefaultPaymentMethod` is defined and has a `card` property before trying to access nested properties
  // console.log(`stripeCustomerId`, stripeCustomerId);

  // console.log(`userDefaultPaymentMethod`, userDefaultPaymentMethod);

  const subscriptionDefaultPaymentMethodId = userDefaultPaymentMethod?.id;
  const cardDetails: PaymentMethodDetails | null =
    userDefaultPaymentMethod?.card
      ? {
          last4: userDefaultPaymentMethod.card.last4,
          display_brand: userDefaultPaymentMethod.card.display_brand,
          exp_year: userDefaultPaymentMethod.card.exp_year,
          exp_month: userDefaultPaymentMethod.card.exp_month
        }
      : null;

  const handleDisplayPaymentMethods = async () => {
    // safely fetch data from stripe (retrievePaymentMethods is server action)
    try {
      const data = await retrievePaymentMethods(stripeCustomerId);
      if (data.length > 0) {
        // @ts-ignore
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Failed to retrieve payment methods:', error);
    }
  };

  return (
    <Card
      title="Billing information"
      description={`Your billing information from Stripe`}
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Change your billing method.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="slim"
                loading={isSubmitting}
                onClick={(e) => handleDisplayPaymentMethods()}
              >
                Update payment method
              </Button>
            </DialogTrigger>
            <DialogContent className="border-zinc-800 bg-zinc-950">
              <DialogHeader>
                <DialogTitle>Edit cards</DialogTitle>
                <DialogDescription>
                  <DisplayPaymentData
                    subscriptionId={subscriptionId}
                    paymentMethods={paymentMethods}
                    subscriptionDefaultPaymentMethodId={
                      subscriptionDefaultPaymentMethodId
                    }
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="slim"
                    // onClick={() => {
                    //   setIsSubmitting(false);
                    // }}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-base">
        {cardDetails ? (
          <p className="font-semibold">
            Card on file:{' '}
            <span className="font-normal ">
              <span className="uppercase">{cardDetails.display_brand} </span>
              <span className="align-top text-xs">****</span>{' '}
              {cardDetails.last4} (expires {cardDetails.exp_month}/
              {cardDetails.exp_year})
            </span>
          </p>
        ) : (
          <p>No card on file</p>
        )}
      </div>
    </Card>
  );
}
