'use client';
import Button from '@/components/ui/Button';
import { getErrorRedirect } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe/client';
import { updatePaymentMethod } from '@/utils/stripe/server';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import {
  CustomCheckoutProvider,
  PaymentElement
} from '@stripe/react-stripe-js';
import {
  createStripePortal,
  retrievePaymentMethods
} from '@/utils/stripe/server';
import Card from '@/components/ui/Card';
// import Stripe from 'stripe';

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
import { set, z } from 'zod';
import {
  ListPaymentMethodSchema,
  PaymentMethodSchema
} from '@/utils/types/zod/types';
import AddNewPaymentMethod from './AddNewPaymentMethod';
import PaymentMethodSetupForm from './PaymentMethodSetupForm';

interface Props {
  userDefaultPaymentMethod: UserDefaultPaymentMethodType;
  stripeCustomerId: string;
  subscriptionId: string;
}

type UserDefaultPaymentMethodType = z.infer<typeof PaymentMethodSchema>;

type ListPaymentMethodSchemaType = z.infer<typeof ListPaymentMethodSchema>;

export const dynamic = 'force-dynamic';

export default function BillingInfo({
  userDefaultPaymentMethod,
  stripeCustomerId,
  subscriptionId
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const currentPath = usePathname();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] =
    useState<ListPaymentMethodSchemaType>([]);
  const [confirmedNewCard, setConfirmedNewCard] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);

  const [showPaymentElement, toggleShowPaymentElement] =
    useState<boolean>(false);

  const subscriptionDefaultPaymentMethodId = userDefaultPaymentMethod.id;

  const cardDetails = {
    last4: userDefaultPaymentMethod.card.last4,
    brand: userDefaultPaymentMethod.card.brand,
    exp_year: userDefaultPaymentMethod.card.exp_year,
    exp_month: userDefaultPaymentMethod.card.exp_month
  };

  const handleDisplayPaymentMethods = async () => {
    toggleShowPaymentElement(false);
    //if the user hasn't confirmed payment method, return and don't fetch new data from stripe
    if (!confirmedNewCard && sessionOpen) {
      return;
    }
    setSessionOpen(true);
    // if the user has confirmed payment method, we need to fetch the updated payment methods

    // safely fetch data from stripe (retrievePaymentMethods is server action)
    try {
      const data = await retrievePaymentMethods(stripeCustomerId);
      const validatedData = ListPaymentMethodSchema.safeParse(data);
      if (!validatedData.success) {
        console.error(validatedData.error.issues);
        return;
      } else {
        setPaymentMethods(validatedData.data);
        console.log('Payment methods data:', validatedData.data);
      }
    } catch (error) {
      console.error('Failed to retrieve payment methods:', error);
    }
  };
  const handleStripePaymentMethodUpdate = async () => {
    setIsSubmitting(true);
    const { errorRedirect, clientSecret } = await updatePaymentMethod(
      stripeCustomerId,
      subscriptionId,
      currentPath
    );
    if (errorRedirect) {
      setIsSubmitting(false);
      return router.push(errorRedirect);
    }
    if (!clientSecret) {
      setIsSubmitting(false);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }
    let stripe;
    try {
      stripe = await getStripe();
    } catch (error) {
      setIsSubmitting(false);
      return router.push(
        getErrorRedirect(
          currentPath,
          'Could not connect to Stripe',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    setStripeInstance(stripe);
    setClientSecret(clientSecret);
    setIsSubmitting(false);
    toggleShowPaymentElement(!showPaymentElement);
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
                </DialogHeader>
                <div>
                  {!showPaymentElement ? (
                    // if !showPaymentElement show DisplayPaymentData
                    // Display available cards
                    <DisplayPaymentData
                      subscriptionId={subscriptionId}
                      paymentMethods={paymentMethods}
                      subscriptionDefaultPaymentMethodId={
                        subscriptionDefaultPaymentMethodId
                      }
                    />
                  ) : stripeCustomerId && clientSecret ? (
                    //  if showPaymentElement show CustomCheckoutProvider
                    // Display Stripe Payment Setup Form
                    <CustomCheckoutProvider
                      stripe={stripeInstance}
                      options={{ clientSecret }}
                    >
                      <PaymentMethodSetupForm
                        onConfirmNewCard={() => setConfirmedNewCard(true)}
                      />
                    </CustomCheckoutProvider>
                  ) : null}
                </div>

                <DialogFooter className="sm:justify-start">
                  {!showPaymentElement ? (
                    <Button
                      variant="slim"
                      className="w-fit"
                      loading={isSubmitting}
                      onClick={() => {
                        handleStripePaymentMethodUpdate();
                      }}
                    >
                      Add card
                    </Button>
                  ) : (
                    <Button
                      variant="slim"
                      className="w-fit"
                      onClick={() => {
                        handleDisplayPaymentMethods();
                      }}
                    >
                      Back
                    </Button>
                  )}
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
