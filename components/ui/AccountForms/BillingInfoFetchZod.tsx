import { Tables } from '@/types_db';
import BillingInfo from './BillingInfo';
import { stripe } from '@/utils/stripe/config';
import Stripe from 'stripe';

import { z } from 'zod';
import {
  CardDetailsSchema,
  PaymentMethodSchema,
  SubscriptionIdSchema,
  SubscriptionSchema
} from '@/utils/types/zod/types';
import { SubscriptionWithPriceAndProduct } from '@/utils/types';

const PropsSchema = z.object({
  subscription: SubscriptionIdSchema
});

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default async function BillingInfoFetchZod({ subscription }: Props) {
  if (!subscription) {
    return null;
  }

  try {
    // subscription is already validated that it's not null
    // validate the subscription object -> it will check if it has id of type string
    const validatedSubscription = PropsSchema.safeParse({ subscription });

    // use validateSubscription from now on
    if (!validatedSubscription.success) {
      console.error(
        'Couldnt validate subscription.',
        validatedSubscription.error.issues
      );
      return;
    }

    const subscriptionId = validatedSubscription.data.subscription.id;

    // fetch the subscription data from stripe and expand the default payment method
    try {
      const existingSubscription = await stripe.subscriptions.retrieve(
        subscriptionId,
        { expand: ['default_payment_method'] }
      );
      if (existingSubscription) {
        const validatedData =
          SubscriptionSchema.safeParse(existingSubscription);

        if (!validatedData.success) {
          console.error(
            'Couldnt retrieve information about subscription from stripe. ',
            validatedData.error.issues
          );
          return;
        }
        const stripeCustomerId = validatedData.data.customer;
        const defaultPaymentMethodData =
          validatedData.data.default_payment_method;
        // now that we have the subscription data: subscriptionId, stripeCustomerId, defaultPaymentMethodData
        return (
          <BillingInfo
            subscriptionId={subscriptionId}
            stripeCustomerId={stripeCustomerId}
            userDefaultPaymentMethod={defaultPaymentMethodData}
          />
        );
      }
    } catch (error) {
      console.error('Error:', error);
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.flatten());
      return null;
    } else {
      console.error('Error:', error);
      return null;
    }
  }
}
