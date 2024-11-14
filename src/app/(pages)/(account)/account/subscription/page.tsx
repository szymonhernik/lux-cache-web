import { Suspense } from 'react'

import AccountSkeleton from '../_components/AccountSkeleton'
import SubscriptionLayout from './_components/SubscriptionLayout'

export const dynamic = 'force-dynamic'

export default async function Page() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <SubscriptionLayout />
    </Suspense>
  )
}
