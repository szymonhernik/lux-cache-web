'use client'

import { getStripe } from '@/utils/stripe/client'
import { CustomCheckoutProvider, PaymentElement } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { getErrorRedirect } from '@/utils/helpers'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

const stripePromise = getStripe()
export default function CustomCheckoutProviderWrapper(props: {
  clientSecret: string
  priceWithTrial: boolean
  daysTrial: number | null
  userCanTrial: boolean
}) {
  const { clientSecret } = props
  const { priceWithTrial, daysTrial, userCanTrial } = props

  if (!clientSecret || !stripePromise) {
    return redirect(
      getErrorRedirect(
        `/`,
        'Invalid payment connection',
        "Sorry, we weren't able to connect to Stripe. Please try again or contact the administrator."
      )
    )
  }

  useEffect(() => {
    // Check if a checkout page is already open
    const isCheckoutOpen = localStorage.getItem('checkoutOpen')
    if (isCheckoutOpen) {
      alert(
        'A checkout page is already open in another tab. Please close it first.'
      )
      // Redirect to another page or close this tab
      window.location.href = '/browse' // or some other appropriate action
    } else {
      // Set the flag in localStorage
      localStorage.setItem('checkoutOpen', 'true')
    }

    // Clean up function to remove the flag when the component is unmounted
    return () => {
      localStorage.removeItem('checkoutOpen')
    }
  }, [])

  return (
    <CustomCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        priceWithTrial={priceWithTrial}
        daysTrial={daysTrial}
        userCanTrial={userCanTrial}
      />
    </CustomCheckoutProvider>
  )
}
