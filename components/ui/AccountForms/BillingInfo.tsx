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
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Card
      title="Billing information"
      description={`Your billing information from Stripe`}
      //   footer={
      //     <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      //       <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
      //       <Button
      //         variant="slim"
      //         onClick={handleStripePortalRequest}
      //         loading={isSubmitting}
      //       >
      //         Open customer portal
      //       </Button>
      //     </div>
      //   }
    >
      <div className="mt-8 mb-4 text-base">
        {userDefaultPaymentMethod ? (
          <p className="font-semibold">
            Card on file:{' '}
            <span className="font-normal capitalize">
              {userDefaultPaymentMethod.display_brand}{' '}
              <span className="align-top text-xs">**** **** ****</span>{' '}
              {userDefaultPaymentMethod.last4} (expires{' '}
              {userDefaultPaymentMethod.exp_month}/
              {userDefaultPaymentMethod.exp_year})
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
