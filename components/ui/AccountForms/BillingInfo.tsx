'use client';

import Button from '@/components/ui/Button';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Tables } from '@/types_db';
import Stripe from 'stripe';

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
}

export default function BillingInfo({ userDefaultPaymentMethod }: Props) {
  // Ensure `userDefaultPaymentMethod` is defined and has a `card` property before trying to access nested properties
  const cardDetails: PaymentMethodDetails | null =
    userDefaultPaymentMethod?.card
      ? {
          last4: userDefaultPaymentMethod.card.last4,
          display_brand: userDefaultPaymentMethod.card.display_brand,
          exp_year: userDefaultPaymentMethod.card.exp_year,
          exp_month: userDefaultPaymentMethod.card.exp_month
        }
      : null;

  return (
    <Card
      title="Billing information"
      description={`Your billing information from Stripe`}
    >
      <div className="mt-8 mb-4 text-base">
        {cardDetails ? (
          <p className="font-semibold">
            Card on file:{' '}
            <span className="font-normal ">
              <span className="uppercase">{cardDetails.display_brand} </span>
              <span className="align-top text-xs">**** **** ****</span>{' '}
              {cardDetails.last4} (expires {cardDetails.exp_month}/
              {cardDetails.exp_year})
            </span>
          </p>
        ) : (
          <p>No card on file</p>
        )}

        {/* {subscription ? (
          `${subscriptionPrice}/${subscription?.prices?.interval}`
        ) : (
          <Link href="/">Choose your plan</Link>
        )} */}
      </div>
    </Card>
  );
}
