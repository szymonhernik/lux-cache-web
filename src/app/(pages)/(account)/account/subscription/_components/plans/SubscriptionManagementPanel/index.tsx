import { ProductWithPrices, SubscriptionWithProduct } from '@/utils/types'

import Card from '@/components/ui/Card'
import clsx from 'clsx'
import { getSubscriptionDetails } from '@/utils/stripe/queries'
import {
  CancelSubscriptionDialog,
  PlansDialog,
  RenewSubscriptionDialog
} from '../SubscriptionDialogs.tsx'
import Stripe from 'stripe'
import { LightningBoltIcon } from '@radix-ui/react-icons'

interface Props {
  products: ProductWithPrices[]
  subscription: SubscriptionWithProduct | null
}

export default async function SubscriptionManagementPanel(props: Props) {
  const { products, subscription } = props
  const isScheduledForCancellation = subscription?.cancel_at_period_end
  let discounts = null
  if (subscription?.id) {
    const stripeSubscription = await getSubscriptionDetails(subscription.id)
    if (!stripeSubscription) {
      throw new Error('Unable to retrieve subscription details.')
    }
    discounts = stripeSubscription.discounts as Stripe.Discount[]
  }

  const price = subscription?.prices
  let priceString = null
  if (price) {
    priceString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency!,
      minimumFractionDigits: 0
    }).format((price.unit_amount || 0) / 100)
  }

  if (!isScheduledForCancellation) {
    return (
      <Card title="Plan type">
        <div className={clsx(`border p-4 rounded-md bg-white space-y-4`)}>
          <div className="space-y-1 ">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  {subscription?.prices?.products?.name}
                </p>
                <p className="text-sm text-secondary-foreground">
                  Next charge date:{` `}
                  {formatDate(subscription?.current_period_end)}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="font-semibold">
                  {priceString} {` `}
                  <span className="font-normal text-secondary-foreground">
                    (VAT incl.)
                  </span>
                </p>
                <DiscountsTags discounts={discounts} />
              </div>
            </div>
          </div>
          <DiscountsInfo discounts={discounts} />
          <hr />
          <div>
            <PlansDialog products={products} subscription={subscription} />
            {` `} or <CancelSubscriptionDialog subscription={subscription} />
          </div>
        </div>
        {/* <div className="mt-8 mb-4 text-xl font-semibold">Plans</div> */}
      </Card>
    )
  } else {
    return (
      <Card title="Plan type">
        <div className={clsx(`border p-4 rounded-md bg-yellow-50 space-y-4`)}>
          <div className="space-y-1">
            <div className="flex justify-between">
              <p className="font-semibold">
                {subscription?.prices?.products?.name}
              </p>
              <p className="font-semibold">
                {priceString} {` `}
                <span className="font-normal text-secondary-foreground">
                  (VAT incl.)
                </span>
              </p>
            </div>
          </div>
          <hr />
          {subscription.cancel_at && (
            <div>
              <p className="text-sm text-secondary-foreground">
                Your subscription has been planned for cancellation on{' '}
                {formatDate(subscription?.cancel_at)}. You will no longer be
                billed after the next billing date.
              </p>
            </div>
          )}
          <RenewSubscriptionDialog subscription={subscription} />
        </div>
      </Card>
    )
  }
}

const formatDate = (dateString: string | undefined) => {
  const date = dateString ? new Date(dateString) : null
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  if (date === null) {
    return 'N/A'
  } else {
    // @ts-ignore
    return date.toLocaleDateString('en-US', options)
  }
}

export const DiscountsInfo = ({
  discounts
}: {
  discounts: Stripe.Discount[] | null
}) => {
  const hasValidDiscounts = discounts?.some(
    (discount) => discount.end && discount.end > Date.now() / 1000
  )

  return (
    <>
      {hasValidDiscounts && (
        <>
          <hr />
          <div className="text-sm flex flex-col gap-2  rounded-lg bg-muted p-2 ">
            <p className="text-secondary-foreground">
              You have active discounts on your subscription. To see your final
              discounted price, check your billing dashboard in the{' '}
              <a href="#manage-billing-invoices" className="underline">
                "Manage Billing & Invoices"
              </a>{' '}
              section.
            </p>
          </div>
        </>
      )}
    </>
  )
}

export const DiscountsTags = ({
  discounts
}: {
  discounts: Stripe.Discount[] | null
}) => {
  const hasValidDiscounts = discounts?.some(
    (discount) => discount.end && discount.end > Date.now() / 1000
  )
  return (
    <>
      {discounts &&
      discounts.length &&
      discounts.length > 0 &&
      hasValidDiscounts ? (
        <div className="flex gap-2 justify-end">
          {discounts
            .filter(
              (discount) => discount.end && discount.end > Date.now() / 1000
            )
            .map((discount) => (
              <div
                key={discount.id}
                className="w-fit text-xs bg-muted flex gap-1 font-semibold px-2 py-1  shadow-sm rounded-md"
              >
                <LightningBoltIcon className="w-4 h-4 text-secondary-foreground" />
                {discount.coupon?.percent_off}% Off for{' '}
                {discount.coupon?.duration_in_months} months
              </div>
            ))}
        </div>
      ) : null}
    </>
  )
}
