import { SubscriptionWithPriceAndProduct } from '@/utils/types'
import { stripe } from '@/utils/stripe/config'
import Stripe from 'stripe'
import Card from '@/components/ui/Card'
import clsx from 'clsx'
import UpdatePaymentMethod from '../UpdatePaymentMethod'

export default async function BillingPanel({
  subscription
}: {
  subscription: SubscriptionWithPriceAndProduct
}) {
  // subscription object comes from supabase -> has no default payment method on it
  try {
    if (!subscription.id) {
      return null
    }

    // to know which payment method is used for a specific Subscription:
    // 1. check the default payment method of the subscription. if there's one, then show that
    // 2. if there's isn't one set, then check the default payment method of the customer

    // retrieve subscription data from stripe using the subscription id
    // then check the default payment method of the subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.id as string,
      {
        expand: ['default_payment_method']
      }
    )
    if (!stripeSubscription) {
      return null
    }

    let paymentMethod = null
    const defaultPaymentMethod = stripeSubscription.default_payment_method
    const stripeCustomerId = stripeSubscription.customer as string

    if (!defaultPaymentMethod) {
      // from Stripe docs: invoices will use the customer’s invoice_settings.default_payment_method or default_source.
      // check the default payment method of the customer
      if (!stripeSubscription.customer) {
        return null
      }
      const customer = (await stripe.customers.retrieve(
        stripeSubscription.customer as string,
        {
          expand: ['invoice_settings.default_payment_method']
        }
      )) as Stripe.Customer
      // invoice_settings.default_payment_method
      const customerDefaultPaymentMethod =
        customer.invoice_settings.default_payment_method
      // if there is no default payment method, then return text saying that you need to contact technical help of Lux Cache
      if (!customerDefaultPaymentMethod) {
        return <WarningCard />
      }
      paymentMethod = customerDefaultPaymentMethod as Stripe.PaymentMethod
    } else {
      paymentMethod = defaultPaymentMethod as Stripe.PaymentMethod
    }

    return (
      <>
        <PaymentMethodPanel
          paymentMethod={paymentMethod}
          stripeCustomerId={stripeCustomerId}
        />
      </>
    )
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return <WarningCard />
  }
}

function PaymentMethodPanel({
  paymentMethod,
  stripeCustomerId
}: {
  paymentMethod: Stripe.PaymentMethod
  stripeCustomerId: string
}) {
  return (
    <Card
      title="Payment Method"
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <UpdatePaymentMethod stripeCustomerId={stripeCustomerId} />
        </div>
      }
    >
      {paymentMethod.type === 'card' && (
        <div className="">
          <p className="font-semibold text-secondary-foreground">
            Card on file:{' '}
            <span className="font-normal ">
              <span className="uppercase">{paymentMethod.card?.brand} </span>
              <span className="align-top text-xs">****</span>{' '}
              {paymentMethod.card?.last4} (expires{' '}
              {paymentMethod.card?.exp_month}/{paymentMethod.card?.exp_year})
            </span>
          </p>
        </div>
      )}
    </Card>
  )
}

function WarningCard() {
  return (
    <Card title="Payment method">
      <div className={clsx(`border p-4 rounded-md bg-yellow-50 space-y-4`)}>
        <p className="text-sm text-secondary-foreground">
          We couldn't retrieve a default payment method for your subscription.
          Please contact technical help of Lux Cache at{' '}
          <a href="mailto:support@luxcache.com" className="underline">
            support@luxcache.com
          </a>
        </p>
      </div>
    </Card>
  )
}
