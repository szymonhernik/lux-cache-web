import BillingInfoFetchZod from '@/components/ui/AccountForms/BillingInfoFetchZod'
import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoSkeleton'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PremiumPlansPanel from '../_components/PremiumPlansPanel'
import Link from 'next/link'

export default async function Page() {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/signin')
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle()

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' })

  if (error) {
    console.log(error)
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold ">Subscription</h1>
      <div className="mt-8">
        {subscription ? (
          <>
            <Suspense fallback={<BillingInfoScheleton />}>
              <BillingInfoFetchZod subscription={subscription} />
            </Suspense>
            {/* <Suspense fallback={<BillingInfoScheleton />}>
              <PremiumPlansPanel
                products={products ?? []}
                subscription={subscription}
              />
            </Suspense> */}
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
