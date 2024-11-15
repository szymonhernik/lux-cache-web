'use client'

import { Button } from '@/components/shadcn/ui/button'
import { CustomPortableTextPages } from '@/components/shared/CustomPortableTextPages'
import { LoadingSpinner } from '@/components/Spinner'
import { cn } from '@/utils/cn'
import { ProductWithPrices } from '@/utils/types'
import { BillingInterval } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import SubmitButton from './SubmitButton'

interface PricingCardProps {
  product: ProductWithPrices
  price: ProductWithPrices['prices'][0]
  billingInterval: BillingInterval
  planDescription?: any
  onSubmit: (formData: FormData) => Promise<void>
}

export function PricingCard({
  product,
  price,
  billingInterval,
  planDescription,
  onSubmit
}: PricingCardProps) {
  const metadata = product.metadata as { trial_allowed?: boolean }

  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency!,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100)

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg shadow-sm divide-zinc-600 relative',
        'flex-1',
        'basis-1/3',
        'max-w-xs'
      )}
    >
      <div className="p-6 space-y-8">
        <h2 className="text-2xl text-center font-semibold leading-6 text-black">
          {product.name}
        </h2>

        <form action={onSubmit}>
          <input type="hidden" name="priceId" value={price.id} />
          <SubmitButton
            priceString={priceString}
            billingInterval={billingInterval}
          />
        </form>

        {planDescription && <CustomPortableTextPages value={planDescription} />}

        {/* {metadata.trial_allowed && (
          <form action={onSubmit}>
            <input type="hidden" name="priceId" value={price.id} />
            <Button
              size={'xl'}
              className={cn(
                `block mx-auto text-sm font-semibold text-center text-white rounded-md`
              )}
            >
              Try with Free Trial
            </Button>
          </form>
        )} */}
      </div>
    </div>
  )
}
