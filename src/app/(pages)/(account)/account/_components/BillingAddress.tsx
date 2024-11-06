'use client'
import Card from '@/components/ui/Card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/ui/dialog'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { getStripe } from '@/utils/stripe/client'
import { useRouter } from 'next/navigation'

const stripePromise = getStripe()

export default function BillingAddress() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  let clientSecretReceived: string | null = null

  return (
    <Card title="Billing Address">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="">
          <Button
            variant={'outline'}
            onClick={() => {
              // handleOpenStripeCheckout()
            }}
          >
            Update billing address
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit billing address</DialogTitle>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            {/* <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button>Yes, renew my subscription</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
