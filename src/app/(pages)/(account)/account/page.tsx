import EmailForm from '@/components/ui/AccountForms/EmailForm'
import NameForm from '@/components/ui/AccountForms/NameForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoSkeleton'
import BillingInfoFetchZod from '@/components/ui/AccountForms/BillingInfoFetchZod'
import PremiumPlansPanel from './_components/PremiumPlansPanel'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single()

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
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-xl font-extrabold  sm:text-center ">Account</h1>
        </div>
      </div>
      <div className="p-4">
        {/* <CustomerPortalForm subscription={subscription} /> */}
        {subscription && (
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
        )}
        {/* <BillingInfoSupabase
          userDefaultPaymentMethod={userDetails?.payment_method}
        /> */}
        <NameForm userName={userDetails?.full_name ?? ''} userId={user?.id} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  )
}
