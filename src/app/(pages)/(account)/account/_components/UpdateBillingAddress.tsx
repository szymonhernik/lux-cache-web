'use client'
import { Button } from '@/components/shadcn/ui/button'
import Card from '@/components/ui/Card'
import { getStripe } from '@/utils/stripe/client'
import { updateCustomerBillingAddress } from '@/utils/stripe/server'
import { SubscriptionWithPriceAndProduct } from '@/utils/types'
import { AddressElement, Elements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
const stripePromise = getStripe()

export type AddressType = {
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
}
export default function UpdateBillingAddress({
  subscription
}: {
  subscription: SubscriptionWithPriceAndProduct | null
}) {
  //   const { confirm, canConfirm, confirmationRequirements } = useCustomCheckout()
  // TODO: make it into a modal component maybe ?
  const subscriptionId = subscription?.id
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canSubmit, setCanSubmit] = useState(false)
  const [address, setAddress] = useState<AddressType>()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) {
      return
    }
    setIsSubmitting(true)
    if (!subscriptionId || !address) {
      return
    }
    const redirectUrl = await updateCustomerBillingAddress(
      subscriptionId,
      address,
      '/account/subscription'
    )
    if (redirectUrl) {
      router.push(redirectUrl)
      router.refresh()
    }
    setIsSubmitting(false)
  }
  return (
    <Card title="Billing address">
      <Elements stripe={stripePromise}>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-8">
          <AddressElement
            options={{ mode: 'billing' }}
            onChange={(event) => {
              if (event.complete) {
                // Extract potentially complete address
                const address = event.value.address
                setAddress(address)

                if (canSubmit !== true) {
                  setCanSubmit(true)
                }
              } else {
                if (canSubmit !== false) {
                  setCanSubmit(false)
                }
              }
            }}
          />
          <Button
            className="w-fit"
            isLoading={isSubmitting}
            disabled={!canSubmit || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Processing' : 'Update address'}
          </Button>
        </form>
      </Elements>
    </Card>
  )
}
