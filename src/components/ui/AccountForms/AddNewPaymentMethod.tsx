import { getErrorRedirect } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe/client'
import { updatePaymentMethod } from '@/utils/stripe/server'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Stripe } from '@stripe/stripe-js'
import { CustomCheckoutProvider, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/shadcn/ui/button'

export default function AddNewPaymentMethod({
  customerId,
  subscriptionId,
  showPaymentElement
}: {
  customerId: string
  subscriptionId: string
  showPaymentElement?: () => void
}) {
  const router = useRouter()
  const currentPath = usePathname()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const handleStripePaymentMethodUpdate = async () => {
    setIsSubmitting(true)
    const { errorRedirect, clientSecret } = await updatePaymentMethod(
      customerId,
      subscriptionId,
      currentPath
    )
    if (errorRedirect) {
      setIsSubmitting(false)
      return router.push(errorRedirect)
    }
    if (!clientSecret) {
      setIsSubmitting(false)
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      )
    }
    let stripe
    try {
      stripe = await getStripe()
    } catch (error) {
      setIsSubmitting(false)
      return router.push(
        getErrorRedirect(
          currentPath,
          'Could not connect to Stripe',
          'Please try again later or contact a system administrator.'
        )
      )
    }

    setStripeInstance(stripe)
    setClientSecret(clientSecret)
    setIsSubmitting(false)
    if (showPaymentElement) {
      showPaymentElement()
    }

    // Here I want to update state of the parent component (BillingInfo) to display content appropriately
  }

  return (
    <div className="flex flex-col gap-4">
      {stripeInstance && clientSecret ? (
        <>
          <CustomCheckoutProvider
            stripe={stripeInstance}
            options={{ clientSecret }}
          >
            <form>
              <PaymentElement />
            </form>
          </CustomCheckoutProvider>
          <Button
            className="w-fit"
            onClick={() => {
              showPaymentElement && showPaymentElement()
            }}
          >
            Back
          </Button>
        </>
      ) : (
        <Button
          className="w-fit"
          isLoading={isSubmitting}
          onClick={() => {
            handleStripePaymentMethodUpdate()
          }}
        >
          Add card
        </Button>
      )}
    </div>
  )
}
