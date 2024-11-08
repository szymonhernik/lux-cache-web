'use client'
import {
  AddressElement,
  PaymentElement,
  useCustomCheckout
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import Link from 'next/link'

import PromotionCodeForm from './PromotionCodeForm'
import OrderSummary from './OrderSummary'
import { Button } from '@/components/shadcn/ui/button'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/shadcn/ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'



import { Progress } from '@/components/shadcn/ui/progress'

export default function CheckoutForm(props: {
  priceWithTrial: boolean
  daysTrial: number | null
  userCanTrial: boolean
}) {
  const { confirm, canConfirm, confirmationRequirements, lineItems, currency } =
    useCustomCheckout()
  const { priceWithTrial, daysTrial, userCanTrial } = props
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [messageBody, setMessageBody] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // if can't confirm don't allow form submission
    if (!canConfirm) {
      e.preventDefault()
      setIsSubmitting(false)
      return
    }
    e.preventDefault()
    setIsSubmitting(true)

    confirm().then((result) => {
      setIsSubmitting(false)
      if (result.session) {
        setIsSuccess(true)
      } else {
        setMessageBody(result.error.message || 'An error occurred')
      }
    })
  }
  return (
    <div className="flex flex-col gap-16 ">
      {!isSuccess ? (
        <>
          <div className="flex flex-col gap-8">
            <OrderSummary daysTrial={daysTrial} userCanTrial={userCanTrial} />
            <PromotionCodeForm />
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-8"
          >
            <div>
              <h1 className="text-xl font-bold mb-4">Billing information</h1>
              <AddressElement options={{ mode: 'billing' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold  mb-4">Payment information</h1>
              <PaymentElement />
            </div>
            <div
              id="messages"
              role="alert"
              className="text-red-500"
              style={messageBody ? { display: 'block' } : { display: 'none' }}
            >
              <AlertDestructive message={messageBody} />
            </div>
            <div className="space-x-2">
              <Button
                className="w-fit"
                isLoading={isSubmitting}
                disabled={!canConfirm || isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Processing' : 'Pay'}
              </Button>
              <Button
                variant="outline"
                className="w-fit"
                disabled={isSubmitting}
              >
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          </form>
        </>
      ) : (
        <SuccessfulPayment />
      )}
    </div>
  )
}

export function AlertDestructive({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export function SuccessfulPayment() {
  return (
    <div className="flex  flex-col items-center  px-4  sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleCheckIcon className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Payment Successful!
        </h1>

        <ProgressCoundown />
      </div>
    </div>
  )
}

function CircleCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function ProgressCoundown() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)
    if (countdown === 0) {
      clearInterval(timer)
      router.push('/browse')
      router.refresh()
    }
    return () => clearInterval(timer)
  }, [countdown])
  return (
    <div className="mt-4">
      Redirecting in {countdown} seconds You will be redirected to the next page
      shortly. Please don't close this page.
      <div className="flex justify-center mt-6">
        <Progress value={(countdown / 5) * 100} className="w-full " />
      </div>
    </div>
  )
}
