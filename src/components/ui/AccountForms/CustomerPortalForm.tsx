'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { createStripePortal } from '@/utils/stripe/server'
import Card from '@/components/ui/Card'
import { Tables } from 'types_db'
import { Button } from '@/components/shadcn/ui/button'

type Subscription = Tables<'subscriptions'>
type Price = Tables<'prices'>
type Product = Tables<'products'>

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null
      })
    | null
}

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter()
  const currentPath = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100)

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true)
    const redirectUrl = await createStripePortal(currentPath)
    setIsSubmitting(false)
    return router.push(redirectUrl)
  }

  return (
    <Card title="Manage Billing & Invoices">
      <div className="flex flex-col gap-4">
        <Button
          onClick={handleStripePortalRequest}
          className="w-fit"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Processing' : 'Open billing dashboard'}
        </Button>
        <p className="pb-4 sm:pb-0 text-sm text-secondary-foreground">
          Access your billing dashboard to view payment history, download
          invoices, and update your billing information.
        </p>
      </div>
    </Card>
  )
}
