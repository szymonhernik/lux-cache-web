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
import BillingAddress from '../_components/BillingAddress'
import UpdateBillingAddress from '../_components/UpdateBillingAddress'
import DiscordIntegration from './_components/discord/DiscordIntegration'
import { getDiscordConnectionStatus } from './_components/discord/actions'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = createClient()

  const [user, products, subscription, discordConnectionStatusResult] =
    await Promise.all([
      getUser(supabase),
      getProducts(supabase),
      getSubscription(supabase),
      getDiscordConnectionStatus(supabase)
    ])

  return (
    <>
      <h1 className="text-2xl font-extrabold ">Subscription</h1>
      <div className="divide-y flex flex-col gap-8 *:pt-8">
        {user?.id && (
          <DiscordIntegration
            discordConnectionStatusResult={discordConnectionStatusResult}
            userId={user?.id}
            subscription={subscription}
          />
        )}
        {subscription ? (
          <>
            <Suspense fallback={<BillingInfoScheleton />}>
              <PremiumPlansPanel
                products={products ?? []}
                subscription={subscription}
              />
            </Suspense>
            <Suspense fallback={<BillingInfoScheleton />}>
              <BillingInfoFetchZod subscription={subscription} />
            </Suspense>

            <UpdateBillingAddress subscription={subscription} />
            {/* <Suspense fallback={<BillingInfoScheleton />}>

              <BillingAddress />
            </Suspense> */}
          </>
        ) : (
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
