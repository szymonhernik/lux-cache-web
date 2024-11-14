import { Suspense } from 'react'
import AccountLayout from './_components/AccountLayout'
import AccountSkeleton from './_components/AccountSkeleton'

export default async function Page() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountLayout />
    </Suspense>
  )
}
