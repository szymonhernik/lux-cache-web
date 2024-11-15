'use client'

import React, { Suspense, useState } from 'react'
import {
  BillingInterval,
  ProductWithPrices,
  SubscriptionWithPriceAndProduct
} from '@/utils/types'

import { PricesQueryResult } from '@/utils/types/sanity/sanity.types'

import Link from 'next/link'

import { PricingCardWrapper } from './PricingCardWrapper'

interface Props {
  data: PricesQueryResult | null
  products: ProductWithPrices[]
  subscription: SubscriptionWithPriceAndProduct | null
}

export default function PricingEmbed({ data, products, subscription }: Props) {
  const { plansFeatures } = data ?? {}
  const hasActiveSubscription = subscription?.status === 'active'
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  )
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month')

  return (
    <>
      <h1 className="text-shadow text-sm font-semibold lg:sticky lg:top-0 p-4 lg:p-6 uppercase ">
        pricing
      </h1>
      <section className="">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:pt-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-xl font-extrabold  sm:text-center ">
              Choose your subscription
            </h1>

            <div className="relative self-center mt-6  rounded-lg p-0.5 flex sm:mt-8 ">
              {intervals.includes('month') && (
                <button
                  onClick={() => setBillingInterval('month')}
                  type="button"
                  className={`${
                    billingInterval === 'month'
                      ? 'relative w-1/2 bg-black  shadow-sm text-primary'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-neutral-600'
                  } rounded-md m-1 py-2 text-sm  whitespace-nowrap  focus:z-10 sm:w-auto sm:px-4  uppercase`}
                >
                  Monthly
                </button>
              )}
              {intervals.includes('year') && (
                <button
                  onClick={() => setBillingInterval('year')}
                  type="button"
                  className={`${
                    billingInterval === 'year'
                      ? 'relative w-1/2 bg-black  shadow-sm text-primary'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-600'
                  } rounded-md m-1 py-2 text-sm  whitespace-nowrap  focus:z-10 sm:w-auto sm:px-4  uppercase`}
                >
                  annual (Save 15%)
                </button>
              )}
            </div>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {products.map((product, index) => {
              const price = product?.prices?.find(
                (price) => price.interval === billingInterval
              )
              if (!price) return null

              return (
                <React.Fragment key={`${product.id}-${billingInterval}`}>
                  <PricingCardWrapper
                    product={product}
                    price={price}
                    billingInterval={billingInterval}
                    planDescription={plansFeatures?.[index]?.planDescription}
                    hasActiveSubscription={hasActiveSubscription}
                  />
                </React.Fragment>
              )
            })}
          </div>
        </div>
        {/* <NoteForActiveSubscribers /> */}
      </section>
    </>
  )
}

function NoteForActiveSubscribers() {
  return (
    <div className="p-6 text-sm space-y-6">
      <hr />
      <p className="">
        For active subscribers, you can{' '}
        <Link href="/account/subscription" className="mx-auto underline">
          manage your subscription from your account dashboard
        </Link>
        .
      </p>
    </div>
  )
}
