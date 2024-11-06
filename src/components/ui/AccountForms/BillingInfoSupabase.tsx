'use client'

import Card from '@/components/ui/Card'

interface PaymentMethodDetails {
  last4: string
  display_brand: string
  exp_year: number
  exp_month: number
  // Add more specific fields as necessary
}

interface Props {
  //   userDefaultPaymentMethod: Stripe.PaymentMethod | null;
  //   userDefaultPaymentMethod: PaymentMethodDetails | null;
  userDefaultPaymentMethod: any
}

export default function BillingInfoSupabase({
  userDefaultPaymentMethod
}: Props) {
  return (
    <Card
      title="Billing information"
      description={`Your billing information from Stripe`}
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
  )
}
