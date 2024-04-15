import { Tables } from '@/types_db';
import BillingInfo from './BillingInfo';
import { stripe } from '@/utils/stripe/config';
import Stripe from 'stripe';

// import {z} from 'zod';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default async function BillingInfoFetch({ subscription }: Props) {
  //retrieve payment method for stripe customer from stripe
  let defaultPaymentMethodData: string | Stripe.PaymentMethod | null = null;
  let stripeCustomerId: string | null = null;
  let subscriptionId: string | undefined = undefined;
  try {
    // Retrieve the subscription ID from Supabase, ensuring it exists
    subscriptionId = subscription?.id;
    if (!subscriptionId) {
      throw new Error('Subscription ID not found.');
    }

    // Retrieve the subscription from Stripe, expanding the default payment method
    const existingSubscription = await stripe.subscriptions.retrieve(
      subscriptionId,
      {
        expand: ['default_payment_method']
      }
    );

    // Check if the subscription and customer information were successfully retrieved
    if (!existingSubscription || !existingSubscription.customer) {
      throw new Error(
        'Failed to retrieve subscription or customer information from Stripe.'
      );
    }
    defaultPaymentMethodData = existingSubscription.default_payment_method;

    // Check the type of the customer property and handle accordingly
    const customer = existingSubscription.customer;
    if (typeof customer === 'string') {
      stripeCustomerId = customer;
    } else {
      // Handle deleted or unexpected customer types
      stripeCustomerId = null;
      throw new Error('Customer data is missing or in an unexpected format.');
    }

    if (!defaultPaymentMethodData) {
      throw new Error(
        'Default payment method not found for the given subscription.'
      );
    }
  } catch (error) {
    console.error(
      'An error occurred while retrieving the payment method:',
      // @ts-ignore
      error.message
    );
  }
  return (
    <BillingInfo
      userDefaultPaymentMethod={defaultPaymentMethodData}
      stripeCustomerId={stripeCustomerId}
      subscriptionId={subscriptionId}
    />
  );
}

//retrieve payment method for stripe customer from stripe
// 1. get subscription id from supabase
// const subscriptionId = subscription?.id;

// let defaultPaymentMethodData;
// // 2. get customer id from stripe by looking up subscription in stripe and expand default payment method
// if (subscriptionId ) {
//   const existingSubscription = await stripe.subscriptions.retrieve(
//     subscriptionId,
//     { expand: ['default_payment_method'] }
//   );
//   const customerId = existingSubscription.customer;

//   // 3. get default payment method id and retrieve payment method from stripe
//   const defaultPaymentMethod = existingSubscription.default_payment_method;
//   defaultPaymentMethodData =  defaultPaymentMethod
// }
// console.log('defaultPaymentMethodData', defaultPaymentMethodData);
