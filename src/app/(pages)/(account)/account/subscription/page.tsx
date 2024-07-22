import BillingInfoFetchZod from '@/components/ui/AccountForms/BillingInfoFetchZod'
import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoSkeleton'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PremiumPlansPanel from '../_components/PremiumPlansPanel'
import Link from 'next/link'
import {
  getProducts,
  getSubscription,
  getUser,
  getUserDetails
} from '@/utils/supabase/queries'

export default async function Page() {
  const supabase = createClient()

  const [products, subscription] = await Promise.all([
    // getUser(supabase),
    // getUserDetails(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ])

  return (
    <>
      <h1 className="text-2xl font-extrabold ">Subscription</h1>
      <div className="divide-y flex flex-col gap-8 *:pt-8">
        {subscription ? (
          <>
            <Suspense fallback={<BillingInfoScheleton />}>
              <BillingInfoFetchZod subscription={subscription} />
            </Suspense>
            <Suspense fallback={<BillingInfoScheleton />}>
              <PremiumPlansPanel
                products={products ?? []}
                subscription={subscription}
              />
            </Suspense>
          </>
        ) : (
          // TODO: Consider having some kind of user's info here? maybe if someone had a subscription and then canceled it, they could still see their info here
          <div>
            You do not have an active subscription. Please{' '}
            <Link href="/pricing" className="underline">
              Subscribe
            </Link>
            .
          </div>
        )}
      </div>
    </>
  )
}
