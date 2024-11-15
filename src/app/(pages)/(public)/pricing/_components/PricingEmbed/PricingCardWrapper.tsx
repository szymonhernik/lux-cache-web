import { checkoutAction } from '@/utils/actions/payments'
import { BillingInterval } from '@/utils/types'

import { ProductWithPrices } from '@/utils/types'
import { useState } from 'react'
import { PricingCard } from './PricingCard'
import { CheckoutModal } from './CheckoutModal'

export function PricingCardWrapper({
  product,
  price,
  billingInterval,
  planDescription
}: {
  product: ProductWithPrices
  price: ProductWithPrices['prices'][0]
  billingInterval: BillingInterval
  planDescription?: any
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const handleCheckout = async (formData: FormData) => {
    const secret = await checkoutAction(formData)
    if (typeof secret === 'string') {
      setIsModalOpen(true)
      setClientSecret(secret)
    }
  }
  return (
    <>
      <PricingCard
        product={product}
        price={price}
        billingInterval={billingInterval}
        planDescription={planDescription}
        onSubmit={handleCheckout}
      />

      <CheckoutModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        clientSecret={clientSecret || ''}
      />
    </>
  )
}
