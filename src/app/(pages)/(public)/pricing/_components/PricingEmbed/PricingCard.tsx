'use client'

import { CustomPortableTextPages } from '@/components/shared/CustomPortableTextPages'
import { LoadingSpinner } from '@/components/Spinner'
import { cn } from '@/utils/cn'
import { ProductWithPrices } from '@/utils/types'
import { BillingInterval } from '@/utils/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import SubmitButton from './SubmitButton'
import { Button } from '@/components/shadcn/ui/button'
import Link from 'next/link'

interface PricingCardProps {
  product: ProductWithPrices
  price: ProductWithPrices['prices'][0]
  billingInterval: BillingInterval
  planDescription?: any
  onSubmit: (formData: FormData) => Promise<void>
  hasActiveSubscription: boolean
}

export function PricingCard({
  product,
  price,
  billingInterval,
  planDescription,
  onSubmit,
  hasActiveSubscription
}: PricingCardProps) {
  const metadata = product.metadata as { trial_allowed?: boolean }

  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency!,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100)

  return (
    <div
      key={product.id}
      className={cn(
        'flex flex-col rounded-lg shadow-sm   divide-zinc-600 relative flex-1 basis-1/3 sm:max-w-xs sm',
        {
          'border border-muted-foreground ': product.name === 'Full Access'
          // product.name === 'Supporter'
        }
      )}
    >
      {product.name === 'Full Access' && (
        <div className="absolute top-0 uppercase italic left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs text-secondery-foreground">
          Most Popular
        </div>
      )}
      {product.name === 'Community' && (
        <div className="absolute top-0 uppercase italic left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-brand px-4  py-1 text-xs ">
          Try with Free Trial
        </div>
      )}
      <div className="p-6 flex flex-col items-center gap-8">
        {/* {metadata.trial_allowed && (
          <p className=" bg-primary  w-fit mx-auto rounded-lg px-4 py-2 absolute -top-6 left-0 right-0 font-semibold uppercase text-center">
            Try with Free Trial
          </p>
        )} */}
        <h2 className="text-2xl text-center font-semibold leading-6 text-black">
          {product.name}
        </h2>

        {!hasActiveSubscription ? (
          <form action={onSubmit}>
            <input type="hidden" name="priceId" value={price.id} />

            <SubmitButton
              priceString={priceString}
              billingInterval={billingInterval}
            />
          </form>
        ) : (
          <Link
            href={'/account/subscription'}
            className="w-full font-normal border-black tracking-tight"
          >
            <Button size={'xl'} variant={'outline'} className="w-full">
              Manage
            </Button>
          </Link>
        )}

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
