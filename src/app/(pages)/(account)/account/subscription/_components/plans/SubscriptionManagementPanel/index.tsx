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
import { CalendarIcon, LightningBoltIcon } from '@radix-ui/react-icons'

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

  return (
    <Card title="Plan type">
      <SubscriptionCard
        subscription={subscription}
        priceString={priceString}
        discounts={discounts}
        products={products}
        isScheduledForCancellation={isScheduledForCancellation}
      />
    </Card>
  )
}

interface SubscriptionCardProps {
  subscription: SubscriptionWithProduct | null
  priceString: string | null
  discounts: Stripe.Discount[] | null
  products: ProductWithPrices[]
  isScheduledForCancellation: boolean | null | undefined
}

function SubscriptionCard({
  subscription,
  priceString,
  discounts,
  products,
  isScheduledForCancellation
}: SubscriptionCardProps) {
  return (
    <div className="border p-6 rounded-md space-y-4 bg-white">
      <div className="space-y-2">
        <div className="flex justify-between ">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-xl">
                {subscription?.prices?.products?.name}
              </p>
              {!isScheduledForCancellation ? (
                <TrialTag subscription={subscription} />
              ) : (
                <div className="text-xs border-secondary border flex gap-1 font-semibold px-2 py-[2px]  shadow-sm rounded-full text-secondary-foreground">
                  Cancelling
                </div>
              )}
            </div>
            {!isScheduledForCancellation && (
              <p className="text-sm text-secondary-foreground">
                Next charge date:{` `}
                {formatDate(subscription?.current_period_end)}
              </p>
            )}
          </div>
          <div className="text-right ">
            <p className="font-semibold tracking-tighter text-xl">
              {priceString}
            </p>
            <span className="font-normal text-sm text-secondary-foreground">
              VAT incl.
            </span>
          </div>
        </div>
      </div>

      {!isScheduledForCancellation && (
        <>
          <DiscountsTags discounts={discounts} />
          <TrialInfo subscription={subscription} />
          <DiscountsInfo discounts={discounts} />
        </>
      )}

      {isScheduledForCancellation ? (
        <>
          {subscription?.cancel_at && (
            <div className="rounded-lg bg-muted p-4 mb-6">
              <div className="space-y-1 text-sm">
                <h4 className="font-semibold ">
                  Subscription Cancellation Scheduled
                </h4>
                <p className=" text-secondary-foreground">
                  Your subscription has been planned for cancellation on{' '}
                  {formatDate(subscription?.cancel_at)}. You will no longer be
                  billed after the next billing date. You can renew your
                  subscription at any time before the cancellation date.
                </p>
              </div>
            </div>
          )}
          {/* <RenewSubscriptionDialog subscription={subscription} /> */}
        </>
      ) : (
        <>
          <hr />
          <div className="flex sm:flex-row flex-col  gap-2 ">
            <PlansDialog products={products} subscription={subscription} />
            {` `} <CancelSubscriptionDialog subscription={subscription} />
          </div>
        </>
      )}
    </div>
  )
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

const TrialTag = ({
  subscription
}: {
  subscription: SubscriptionWithProduct | null
}) => {
  if (!subscription?.trial_end || subscription.status !== 'trialing') {
    return null
  }

  const trialEndTimestamp = new Date(subscription.trial_end).getTime() / 1000
  const currentTimestamp = Date.now() / 1000
  const isTrialActive = trialEndTimestamp >= currentTimestamp

  if (!isTrialActive) {
    return null
  }
  return (
    <div className="text-xs bg-muted flex gap-1 font-semibold px-2 py-[2px]   shadow-sm rounded-full">
      Trial
    </div>
  )
}
const TrialInfo = ({
  subscription
}: {
  subscription: SubscriptionWithProduct | null
}) => {
  // Skip if no subscription or trial data
  if (!subscription?.trial_end || subscription.status !== 'trialing') {
    return null
  }

  const trialEndTimestamp = new Date(subscription.trial_end).getTime() / 1000
  const currentTimestamp = Date.now() / 1000
  const isTrialActive = trialEndTimestamp >= currentTimestamp

  if (!isTrialActive) {
    return null
  }

  return (
    <>
      <div className="text-sm flex flex-col gap-1 rounded-lg bg-secondary/50 p-4  text-secondary-foreground">
        <div className="font-semibold text-primary-foreground">
          Trial period active
        </div>
        <div>
          Ends{` `}
          {formatDate(subscription.trial_end)}
        </div>
        <div className="">
          You will be charged after the trial period ends unless you cancel.
        </div>
      </div>
    </>
  )
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
          <div className="text-sm flex flex-col gap-2  rounded-lg bg-secondary/50  p-4 ">
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
        <div className="flex gap-2">
          {discounts
            .filter(
              (discount) => discount.end && discount.end > Date.now() / 1000
            )
            .map((discount) => (
              <div
                key={discount.id}
                className="w-fit text-xs bg-muted flex gap-1 font-semibold px-2 py-[2px]  shadow-sm rounded-full  items-center"
              >
                <LightningBoltIcon className="w-3 h-3 " />
                {discount.coupon?.percent_off}% Off for{' '}
                {discount.coupon?.duration_in_months} months
              </div>
            ))}
        </div>
      ) : null}
    </>
  )
}
