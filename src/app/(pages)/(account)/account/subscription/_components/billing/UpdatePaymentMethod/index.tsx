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
import { ListPaymentMethodSchema } from '@/utils/types/zod/types'
import { retrievePaymentMethods } from '@/utils/stripe/server'
import { z } from 'zod'

type ListPaymentMethodSchemaType = z.infer<typeof ListPaymentMethodSchema>

export default function UpdatePaymentMethod({
  stripeCustomerId
}: {
  stripeCustomerId: string
}) {
  const [paymentMethods, setPaymentMethods] =
    useState<ListPaymentMethodSchemaType>([])
  const [isLoading, setIsLoading] = useState(false)
  // safely fetch data from stripe (retrievePaymentMethods is server action)

  const handleDisplayPaymentMethods = async () => {
    try {
      const data = await retrievePaymentMethods(stripeCustomerId)
      //   for now validation assumes the only available payment method atm is card
      const validatedData = ListPaymentMethodSchema.safeParse(data)
      if (!validatedData.success) {
        console.error(validatedData.error.issues)
        return
      } else {
        setPaymentMethods(validatedData.data)
      }
    } catch (error) {
      console.error('Failed to retrieve payment methods:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          onClick={() => {
            handleDisplayPaymentMethods()
          }}
        >
          Update payment method
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update payment method</DialogTitle>
          <DialogDescription>
            <ul>
              <li>Card 1</li>
              <li>Card 2</li>
              <li>Card 3</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
