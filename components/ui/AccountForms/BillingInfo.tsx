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
import { z } from 'zod';
import { PaymentMethodSchema } from '@/utils/zod/types';

interface Props {
  userDefaultPaymentMethod: UserDefaultPaymentMethodType;
  stripeCustomerId: string;
  subscriptionId: string;
}

type UserDefaultPaymentMethodType = z.infer<typeof PaymentMethodSchema>;

export const dynamic = 'force-dynamic';

export default function BillingInfo({
  userDefaultPaymentMethod,
  stripeCustomerId,
  subscriptionId
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]); // State to store payment methods

  console.log('userDefaultPaymentMethod', userDefaultPaymentMethod);

  const subscriptionDefaultPaymentMethodId = userDefaultPaymentMethod.id;

  const cardDetails = {
    last4: userDefaultPaymentMethod.card.last4,
    brand: userDefaultPaymentMethod.card.brand,
    exp_year: userDefaultPaymentMethod.card.exp_year,
    exp_month: userDefaultPaymentMethod.card.exp_month
  };

  const handleDisplayPaymentMethods = async () => {
    // safely fetch data from stripe (retrievePaymentMethods is server action)
    try {
      if (stripeCustomerId) {
        const data = await retrievePaymentMethods(stripeCustomerId);
        if (data.length > 0) {
          // @ts-ignore
          setPaymentMethods(data);
        } else {
          throw new Error('No payment methods found.');
        }
      } else {
        throw new Error('Stripe customer ID not found.');
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
          <>
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
          </>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-base">
        <p className="font-semibold">
          Card on file:{' '}
          <span className="font-normal ">
            <span className="uppercase">{cardDetails.brand} </span>
            <span className="align-top text-xs">****</span> {cardDetails.last4}{' '}
            (expires {cardDetails.exp_month}/{cardDetails.exp_year})
          </span>
        </p>
      </div>
    </Card>
  );
}
