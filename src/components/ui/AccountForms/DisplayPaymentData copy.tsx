import { Button } from '@/components/shadcn/ui/button'
import {
  detachPaymentMethod,
  updateSubscriptionDefaultPaymentMethod
} from '@/utils/stripe/server'
import { ListPaymentMethodSchema } from '@/utils/types/zod/types'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'

type ListPaymentMethodSchemaType = z.infer<typeof ListPaymentMethodSchema>

export default function DisplayPaymentData({
  paymentMethods,
  subscriptionDefaultPaymentMethodId,
  subscriptionId,
  onCardsUpdate
}: {
  paymentMethods: ListPaymentMethodSchemaType
  subscriptionDefaultPaymentMethodId: string | null
  subscriptionId: string
  onCardsUpdate: () => void
}) {
  // console.log('paymentMethods in new component', paymentMethods);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethodIdLoading, setPaymentMethodIdLoading] = useState<string>()
  const router = useRouter()
  const currentPath = usePathname()

  const handleStripePaymentMethodDetach = async (paymentMethodId: string) => {
    // TODO: Check if there is only one payment method left and show a message that the user needs to have at least one payment method

    console.log('Deleting payment method with id:', paymentMethodId)
    setIsSubmitting(true)
    setPaymentMethodIdLoading(paymentMethodId)
    try {
      const redirectUrl: string = await detachPaymentMethod(
        paymentMethodId,
        currentPath
      )
      setPaymentMethodIdLoading(undefined)
      setIsSubmitting(false)

      router.push(redirectUrl)
      // router.refresh();
      onCardsUpdate()
    } catch (error) {
      console.error('Error deleting payment method', error)
    }
  }

  const handleSetNewDefaultPaymentMethod = async (paymentMethodId: string) => {
    setIsSubmitting(true)
    setPaymentMethodIdLoading(paymentMethodId)

    // Call the function to set the new default payment method
    // let redirectUrl: string;
    try {
      const redirectUrl: string = await updateSubscriptionDefaultPaymentMethod(
        paymentMethodId,
        subscriptionId,
        currentPath
      )
      router.push(redirectUrl)
      router.refresh()
      setPaymentMethodIdLoading(undefined)
      setIsSubmitting(false)
    } catch (error) {
      return
    }
    console.log('New default payment method set.')
  }
  return (
    <>
      {paymentMethods.length > 0 ? (
        <ul className="*:p-4 *:border *:border-zinc-600 *:my-2 *:rounded *:text-white">
          {paymentMethods.map((paymentMethod, index) => (
            <li
              key={`paymentMethod-${index}`}
              className="flex flex-col justify-between gap-4"
            >
              <div>
                <p className="uppercase font-semibold">
                  {paymentMethod.card.brand}
                </p>
                <p className="text-xs">
                  <span className="align-top text-[10px]">****</span>{' '}
                  {paymentMethod.card.last4} (expires{' '}
                  {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year})
                </p>
              </div>
              <div className="flex gap-2">
                {/* display Button "Set as default" for all except the one that paymentMethods.id === subscriptionDefaultPaymentMethodId  */}
                {paymentMethod.id ===
                subscriptionDefaultPaymentMethodId ? null : (
                  <>
                    <Button
                      type="submit"
                      className="!py-0 !px-4"
                      onClick={() =>
                        handleSetNewDefaultPaymentMethod(paymentMethod.id)
                      }
                      // loading={isSubmitting}
                      isLoading={
                        paymentMethodIdLoading === paymentMethod.id &&
                        isSubmitting
                      }
                    >
                      Set as default
                    </Button>
                    <Button
                      type="submit"
                      className="!py-0 !px-4 "
                      isLoading={
                        paymentMethodIdLoading === paymentMethod.id &&
                        isSubmitting
                      }
                      onClick={() =>
                        handleStripePaymentMethodDetach(paymentMethod.id)
                      }
                      // loading={isSubmitting}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
