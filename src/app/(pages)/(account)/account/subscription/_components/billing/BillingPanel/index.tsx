import { SubscriptionWithPriceAndProduct } from '@/utils/types'
import { stripe } from '@/utils/stripe/config'
import Stripe from 'stripe'
import Card from '@/components/ui/Card'
import clsx from 'clsx'
import UpdatePaymentMethod from '../UpdatePaymentMethod'
import { getSubscriptionDetails } from '@/utils/stripe/queries'

// to know which payment method is used for a specific Subscription:
// 1. check the default payment method of the subscription. if there's one, then show that
// 2. if there's isn't one set, then check the default payment method of the customer
async function getDefaultPaymentMethod(subscriptionId: string) {
  // retrieve subscription data from stripe using the subscription id
  // then check the default payment method of the subscription
  const stripeSubscription = await getSubscriptionDetails(subscriptionId)
  if (!stripeSubscription) {
    return { error: 'Unable to retrieve subscription details.' }
  }

  const defaultPaymentMethod = stripeSubscription.default_payment_method
  const stripeCustomerId = stripeSubscription.customer as string

  if (!defaultPaymentMethod) {
    // from Stripe docs: invoices will use the customer's invoice_settings.default_payment_method or default_source.
    // check the default payment method of the customer
    if (!stripeCustomerId) {
      return { error: 'No customer information found for this subscription.' }
    }

    const customer = (await stripe.customers.retrieve(stripeCustomerId, {
      expand: ['invoice_settings.default_payment_method']
    })) as Stripe.Customer

    // invoice_settings.default_payment_method
    const customerDefaultPaymentMethod =
      customer.invoice_settings.default_payment_method
    // if there is no default payment method, then return text saying that you need to contact technical help of Lux Cache
    if (!customerDefaultPaymentMethod) {
      return { error: 'No default payment method found for your account.' }
    }

    return {
      paymentMethod: customerDefaultPaymentMethod as Stripe.PaymentMethod,
      stripeCustomerId
    }
  }

  return {
    paymentMethod: defaultPaymentMethod as Stripe.PaymentMethod,
    stripeCustomerId
  }
}

export default async function BillingPanel({
  subscription
}: {
  subscription: SubscriptionWithPriceAndProduct
}) {
  // subscription object comes from supabase -> has no default payment method on it
  try {
    if (!subscription.id) {
      return <WarningCard message="No subscription information found." />
    }

    const result = await getDefaultPaymentMethod(subscription.id)

    if ('error' in result) {
      return <WarningCard message={result.error} />
    }

    return (
      <PaymentMethodPanel
        paymentMethod={result.paymentMethod}
        stripeCustomerId={result.stripeCustomerId}
        subscriptionId={subscription.id}
      />
    )
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return (
      <WarningCard message="An unexpected error occurred while fetching payment details." />
    )
  }
}

function PaymentMethodPanel({
  paymentMethod,
  stripeCustomerId,
  subscriptionId
}: {
  paymentMethod: Stripe.PaymentMethod
  stripeCustomerId: string
  subscriptionId: string
}) {
  return (
    <Card
      title="Payment Method"
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <UpdatePaymentMethod
            stripeCustomerId={stripeCustomerId}
            defaultPaymentMethodId={paymentMethod.id}
            subscriptionId={subscriptionId}
          />
        </div>
      }
    >
      {paymentMethod.type === 'card' && (
        <DisplayActiveCard paymentMethod={paymentMethod} />
      )}
    </Card>
  )
}
function DisplayActiveCard({
  paymentMethod
}: {
  paymentMethod: Stripe.PaymentMethod
}) {
  return (
    <div className="">
      <p className="font-semibold text-secondary-foreground">
        Card on file:{' '}
        <span className="font-normal ">
          <span className="uppercase">{paymentMethod.card?.brand} </span>
          <span className="align-top text-xs">****</span>{' '}
          {paymentMethod.card?.last4} (expires {paymentMethod.card?.exp_month}/
          {paymentMethod.card?.exp_year})
        </span>
      </p>
    </div>
  )
}
function WarningCard({ message }: { message?: string }) {
  return (
    <Card title="Payment method">
      <div className={clsx(`border p-4 rounded-md bg-yellow-50 space-y-4`)}>
        <p className="text-sm text-secondary-foreground">
          {message ||
            "We couldn't retrieve a default payment method for your subscription."}{' '}
          Please contact technical help of Lux Cache at{' '}
          <a href="mailto:support@luxcache.com" className="underline">
            support@luxcache.com
          </a>
        </p>
      </div>
    </Card>
  )
}
