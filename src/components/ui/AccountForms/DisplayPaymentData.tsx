import { Button } from '@/components/shadcn/ui/button'
import {
  detachPaymentMethod,
  updateSubscriptionDefaultPaymentMethod
} from '@/utils/stripe/server'
import { ListPaymentMethodSchema } from '@/utils/types/zod/types'
import { redirect, usePathname, useRouter } from 'next/navigation'
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
  // const [paymentMethodIdLoading, setPaymentMethodIdLoading] =
  //   useState<string>();
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
        <ul className="*:p-4 *:border *:border-zinc-600 *:my-2 *:rounded ">
          {paymentMethods.map((paymentMethod, index) => (
            <li
              key={`paymentMethod-${index}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                      variant="secondary"
                      type="submit"
                      size="sm"
                      className="!py-0 !px-4"
                      onClick={() =>
                        handleAction(paymentMethod.id, 'setDefault')
                      }
                      isLoading={
                        activeButtonState.id === paymentMethod.id &&
                        activeButtonState.action === 'setDefault'
                      }
                    >
                      Set as default
                    </Button>
                    <Button
                      variant="secondary"
                      type="submit"
                      size="sm"
                      className="!py-0 !px-4"
                      onClick={() => handleAction(paymentMethod.id, 'detach')}
                      isLoading={
                        activeButtonState.id === paymentMethod.id &&
                        activeButtonState.action === 'detach'
                      }
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
