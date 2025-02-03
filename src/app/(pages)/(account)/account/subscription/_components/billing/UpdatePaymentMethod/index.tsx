'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/ui/dialog'
import { Button } from '@/components/shadcn/ui/button'
import { useState } from 'react'
import { StoredPaymentCardsSchema } from '@/utils/types/zod/types'
import {
  retrievePaymentMethods,
  createSetupSession
} from '@/utils/stripe/server'
import { z } from 'zod'
import DisplayPaymentData from '@/components/ui/AccountForms/DisplayPaymentData'
import { usePathname, useRouter } from 'next/navigation'
import { Stripe } from '@stripe/stripe-js'
import { getErrorRedirect } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe/client'
import { CustomCheckoutProvider } from '@stripe/react-stripe-js'
import PaymentMethodSetupForm from '@/components/ui/AccountForms/PaymentMethodSetupForm'

type StoredPaymentCardsSchemaType = z.infer<typeof StoredPaymentCardsSchema>

export default function UpdatePaymentMethod({
  stripeCustomerId,
  defaultPaymentMethodId,
  subscriptionId
}: {
  stripeCustomerId: string
  defaultPaymentMethodId: string
  subscriptionId: string
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [paymentMethods, setPaymentMethods] =
    useState<StoredPaymentCardsSchemaType>([])
  const [showPaymentElement, setShowPaymentElement] = useState(false)
  const router = useRouter()
  const currentPath = usePathname()
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  // safely fetch data from stripe (retrievePaymentMethods is server action)

  const handleDisplayPaymentMethods = async () => {
    setShowPaymentElement(false)
    try {
      const data = await retrievePaymentMethods(stripeCustomerId)
      // console.log('data', data)

      //   for now validation assumes the only available payment method atm is card
      const validatedListOfCards = StoredPaymentCardsSchema.safeParse(data)
      if (!validatedListOfCards.success) {
        // console.log('validation failed')
        console.error(validatedListOfCards.error.issues)
        return
      } else {
        setPaymentMethods(validatedListOfCards.data)
      }
    } catch (error) {
      const redirectUrl = getErrorRedirect(
        '/account',
        'Could not retrieve payment methods.',
        'Please try again later or contact a system administrator.'
      )
      console.error('Failed to retrieve payment methods:', error)
      return router.push(redirectUrl)
    }
  }
  const handleStripePaymentMethodUpdate = async () => {
    setIsSubmitting(true)
    const { errorRedirect, clientSecret } = await createSetupSession(
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
    setShowPaymentElement(true)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          isLoading={isSubmitting}
          onClick={() => {
            handleDisplayPaymentMethods()
          }}
        >
          Update payment method
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit cards</DialogTitle>
        </DialogHeader>
        <div>
          {!showPaymentElement ? (
            // possibly refactor the code in DisplayPaymentData
            <DisplayPaymentData
              key={Math.random()}
              stripeCustomerId={stripeCustomerId}
              subscriptionId={subscriptionId}
              paymentMethods={paymentMethods}
              subscriptionDefaultPaymentMethodId={defaultPaymentMethodId}
              onCardsUpdate={() => handleDisplayPaymentMethods()}
            />
          ) : stripeCustomerId && clientSecret ? (
            //  if showPaymentElement show CustomCheckoutProvider
            // Display Stripe Payment Setup Form
            <CustomCheckoutProvider
              stripe={stripeInstance}
              options={{ clientSecret }}
            >
              <PaymentMethodSetupForm
                onConfirmNewCard={() => {
                  handleDisplayPaymentMethods()
                }}
              />
            </CustomCheckoutProvider>
          ) : null}
        </div>
        <DialogFooter className="sm:justify-start">
          {!showPaymentElement ? (
            <Button
              size="lg"
              className="w-fit"
              isLoading={isSubmitting}
              onClick={() => {
                handleStripePaymentMethodUpdate()
              }}
            >
              Add card
            </Button>
          ) : (
            <Button
              variant={'outline'}
              className="w-fit"
              size="lg"
              onClick={() => {
                handleDisplayPaymentMethods()
              }}
            >
              Back
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
