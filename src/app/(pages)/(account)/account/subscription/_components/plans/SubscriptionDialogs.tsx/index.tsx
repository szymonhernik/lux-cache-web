'use client'

import { Button } from '@/components/shadcn/ui/button'

import {
  updateSubscription,
  updateSubscriptionPlan
} from '@/utils/stripe/server'
import { ProductWithPrices, SubscriptionWithProduct } from '@/utils/types'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/ui/dialog'
import Link from 'next/link'

export function PlansDialog({
  products,
  subscription
}: {
  products: ProductWithPrices[]
  subscription: SubscriptionWithProduct | null
}) {
  const router = useRouter()
  const currentPath = usePathname()
  const isSubscribedTo = (priceId: string) => {
    return subscription?.prices?.id === priceId
  }
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null)
  const [selectedProductName, setSelectedProductName] = useState<string | null>(
    null
  )
  const [selectedPriceInterval, setSelectedPriceInterval] = useState<
    string | null
  >(null)

  const [step, setStep] = useState<number>(1)

  const handleSwitchPlans = async (
    subscriptionId: string | undefined,
    newPriceId: string | null
  ) => {
    setIsSubmitting(true)

    if (!subscriptionId || !newPriceId) {
      return
    }

    const redirectUrl = await updateSubscriptionPlan(
      subscriptionId,
      newPriceId,
      currentPath
    )
    if (redirectUrl) {
      router.push(redirectUrl)
      router.refresh()
    }
    setIsSubmitting(false)
    setOpen(false)
  }

  const handleResetDialog = () => {
    setOpen(false)
    setStep(1)
    setSelectedPriceId(null)
  }

  useEffect(() => {
    if (!open) {
      // add .5 sec delay and reset
      setTimeout(() => {
        handleResetDialog()
      }, 500)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="underline flex-1" asChild>
        <Button size={'lg'} variant={'outline'} className="w-full">
          Change plan
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="font-normal">
                Switch from your current plan to:
              </DialogTitle>
              <ul className="mt-4 divide-y space-y-4">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="pt-4 flex items-center justify-between w-full"
                  >
                    <h2 className="font-semibold text-primary-foreground ">
                      {product.name}
                    </h2>

                    <div className=" flex gap-2 ">
                      {product.prices.map((price) => (
                        <div key={price.id} className="flex  items-center ">
                          <Button
                            variant={
                              selectedPriceId === price.id
                                ? 'default'
                                : 'outline'
                            }
                            size={'sm'}
                            disabled={isSubscribedTo(price.id)}
                            onClick={() => {
                              setSelectedPriceId(price.id)
                              setSelectedProductName(product.name)
                              setSelectedPriceInterval(price.interval)
                            }}
                          >
                            <span className="text-xs">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: price.currency!,
                                minimumFractionDigits: 0
                              }).format((price?.unit_amount || 0) / 100)}{' '}
                              / {price.interval}
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </DialogHeader>
            <div className="grid gap-4 py-4"></div>
            <DialogFooter className="sm:justify-start">
              <Button
                onClick={() => {
                  selectedPriceId && setStep(2)
                }}
                disabled={!selectedPriceId}
                isLoading={isSubmitting}
              >
                Continue
              </Button>
            </DialogFooter>
            <p className="text-sm text-secondary-foreground">
              Go to{' '}
              <Link href={'/pricing'} className={'underline'}>
                Plans
              </Link>{' '}
              for more information about the plans.
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="font-normal">
                Are you sure you want to switch to{' '}
                <span className="font-semibold">{selectedProductName}</span>,{' '}
                <span className="font-semibold">{selectedPriceInterval}ly</span>{' '}
                billed subscription?
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4"></div>
            <DialogFooter className="sm:justify-start">
              <Button onClick={() => setOpen(false)} variant={'outline'}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSwitchPlans(subscription?.id, selectedPriceId)
                }}
                disabled={!selectedPriceId}
                isLoading={isSubmitting}
              >
                Yes, change subscription
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function CancelSubscriptionDialog({
  subscription
}: {
  subscription: SubscriptionWithProduct | null
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const currentPath = usePathname()

  const handleCancelSubscription = async (
    subscriptionId: string | undefined
  ) => {
    setIsSubmitting(true)
    if (!subscriptionId) {
      return
    }
    const redirectUrl = await updateSubscription(
      subscriptionId,
      currentPath,
      'cancel'
    )
    if (redirectUrl) {
      router.push(redirectUrl)
      router.refresh()
    }
    setIsSubmitting(false)
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="underline flex-1" asChild>
        <Button size={'lg'} variant={'outline'} className=" w-full">
          Cancel current subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to cancel your subscription?
          </DialogTitle>
          <DialogDescription className="text-secondary-foreground">
            Your subscription and the premium features will remain available to
            you until the end of the billing period. After your subscription is
            cancelled your premium features will be cancelled but your bookmarks
            and account information stay.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter className="sm:justify-start">
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleCancelSubscription(subscription?.id)}>
            Yes, unsubscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function RenewSubscriptionDialog({
  subscription
}: {
  subscription: SubscriptionWithProduct | null
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const currentPath = usePathname()

  const handleCancelSubscription = async (
    subscriptionId: string | undefined
  ) => {
    setIsSubmitting(true)
    if (!subscriptionId) {
      return
    }
    const redirectUrl = await updateSubscription(
      subscriptionId,
      currentPath,
      'renew'
    )
    if (redirectUrl) {
      router.push(redirectUrl)
      router.refresh()
    }
    setIsSubmitting(false)
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="">
        <Button variant={'outline'}>Renew subscription</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to renew your subscription?
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter className="sm:justify-start">
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleCancelSubscription(subscription?.id)}>
            Yes, renew my subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
