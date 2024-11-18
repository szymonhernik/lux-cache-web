import { Button } from '@/components/shadcn/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/ui/radio-group'
import { Label } from '@/components/shadcn/ui/label'
import { CreditCard, CheckCircle2, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { LoadingSpinner } from '@/components/Spinner'
import {
  detachPaymentMethod,
  updateSubscriptionDefaultPaymentMethod
} from '@/utils/stripe/server'
import { StoredPaymentCardsSchema } from '@/utils/types/zod/types'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'

type StoredPaymentCardsSchemaType = z.infer<typeof StoredPaymentCardsSchema>

export default function DisplayPaymentData({
  stripeCustomerId,
  paymentMethods,
  subscriptionDefaultPaymentMethodId,
  subscriptionId,
  onCardsUpdate
}: {
  stripeCustomerId: string
  paymentMethods: StoredPaymentCardsSchemaType
  subscriptionDefaultPaymentMethodId: string | null
  subscriptionId: string
  onCardsUpdate: () => void
}) {
  const [activeButtonState, setActiveButtonState] = useState({
    id: '',
    action: ''
  })

  const router = useRouter()
  const currentPath = usePathname()

  const handleAction = async (
    paymentMethodId: string,
    action: 'detach' | 'setDefault'
  ) => {
    setActiveButtonState({ id: paymentMethodId, action })
    try {
      let redirectUrl: string = ''
      if (action === 'detach') {
        redirectUrl = await detachPaymentMethod(paymentMethodId, currentPath)
      } else if (action === 'setDefault') {
        redirectUrl = await updateSubscriptionDefaultPaymentMethod(
          paymentMethodId,
          subscriptionId
        )
      }
      onCardsUpdate()
      router.push(redirectUrl)
      router.refresh()
    } catch (error) {
      console.error('Error processing payment method action:', error)
    } finally {
      setActiveButtonState({ id: '', action: '' })
    }
  }
  return (
    <>
      {paymentMethods.length > 0 ? (
        <RadioGroup
          value={subscriptionDefaultPaymentMethodId || undefined}
          onValueChange={(value) => handleAction(value, 'setDefault')}
          disabled={activeButtonState.id !== ''}
        >
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className="flex items-center space-x-2 space-y-2"
            >
              <RadioGroupItem value={paymentMethod.id} id={paymentMethod.id} />
              <Label
                htmlFor={paymentMethod.id}
                className="flex flex-1 items-center justify-between rounded-lg border p-4 hover:bg-accent"
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-tertiary-foreground" />
                  <span className=" text-sm">
                    Card ending in {paymentMethod.card.last4}
                  </span>
                </div>
                <span className="text-sm text-tertiary-foreground">
                  Expires {paymentMethod.card.exp_month}/
                  {paymentMethod.card.exp_year}
                </span>
              </Label>
              {activeButtonState.id === paymentMethod.id &&
              activeButtonState.action === 'setDefault' ? (
                <LoadingSpinner
                  className="h-4 w-4 animate-spin mr-2"
                  size={24}
                />
              ) : null}
              {paymentMethod.id === subscriptionDefaultPaymentMethodId && (
                <div className="flex justify-center items-center w-9 h-9">
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground " />
                </div>
              )}
              {paymentMethod.id !== subscriptionDefaultPaymentMethodId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove card</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to remove this card?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your card information from our records.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleAction(paymentMethod.id, 'detach')}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </RadioGroup>
      ) : (
        <LoadingSpinner className="my-10 animate-spin mx-auto" size={24} />
      )}
    </>
  )
}
