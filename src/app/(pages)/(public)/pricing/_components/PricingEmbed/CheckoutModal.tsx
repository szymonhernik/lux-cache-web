'use client'

import { Dialog, DialogContent } from '@/components/shadcn/ui/dialog'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js'

export function CheckoutModal({
  isOpen,
  clientSecret,
  setIsOpen
}: {
  isOpen: boolean
  clientSecret: string
  setIsOpen: (isOpen: boolean) => void
}) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90dvh]  overflow-y-auto">
          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="" />
            </EmbeddedCheckoutProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
