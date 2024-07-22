'use client'

import { Button } from '@/components/shadcn/ui/button'
import Card from '@/components/ui/Card'
import { updateSubscriptionPlan } from '@/utils/stripe/server'
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

interface Props {
  products: ProductWithPrices[]
  subscription: SubscriptionWithProduct | null
}

export default function PremiumPlansPanel(props: Props) {
  const { products, subscription } = props

  console.log('subscription', subscription)

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
      <div className="border p-4 rounded-md bg-white space-y-4">
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
          <p className="text-sm text-secondary-foreground">
            Next charge date:{` `}
            {formatDate(subscription?.current_period_end)}
          </p>
        </div>
        <hr />
        <div>
          <PlansDialog products={products} subscription={subscription} />
          {` `} or <CancelSubscriptionDialog />
        </div>
      </div>
      {/* <div className="mt-8 mb-4 text-xl font-semibold">Plans</div> */}
    </Card>
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

function PlansDialog({
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
      setOpen(false)
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
      <DialogTrigger className="underline">Change plan</DialogTrigger>

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

function CancelSubscriptionDialog() {
  return (
    <Dialog>
      <DialogTrigger className="underline">
        Cancel current subscription
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
