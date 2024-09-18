import { Suspense } from 'react'
import PricingLayout from './_components/PricingLayout'
import PricingSkeleton from './_components/PricingSkeleton'

export default async function PricingPage() {
  return (
    <Suspense fallback={<PricingSkeleton />}>
      <PricingLayout />
    </Suspense>
  )
}
