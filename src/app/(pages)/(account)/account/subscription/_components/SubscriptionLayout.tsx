import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoSkeleton'
import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  getDiscordConnectionStatus,
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries'

import { ENABLE_DISCORD_INTEGRATION } from '@/config/featureFlags'
import DiscordIntegration from './discord/DiscordIntegration'
import SubscriptionManagementPanel from './plans/SubscriptionManagementPanel'
import BillingPanel from './billing/BillingPanel'
import UpdateBillingAddress from './billing/UpdateBillingAddress'

export const dynamic = 'force-dynamic'

export default async function SubscriptionLayout() {
  const supabase = createClient()

  const [user, products, subscription, discordConnectionStatusResult] =
    await Promise.all([
      getUser(supabase),
      getProducts(supabase),
      getSubscription(supabase),
      ENABLE_DISCORD_INTEGRATION
        ? getDiscordConnectionStatus(supabase)
        : Promise.resolve(null)
    ])

  return (
    <>
      <h1 className="text-2xl font-extrabold ">Subscription</h1>
      <div className="divide-y flex flex-col gap-8 *:pt-8">
        {ENABLE_DISCORD_INTEGRATION && user?.id && (
          <DiscordIntegration
            discordConnectionStatusResult={discordConnectionStatusResult}
            userId={user.id}
            subscription={subscription}
          />
        )}
        {subscription ? (
          <>
            <Suspense fallback={<BillingInfoScheleton />}>
              <SubscriptionManagementPanel
                products={products ?? []}
                subscription={subscription}
              />
            </Suspense>
            <Suspense fallback={<BillingInfoScheleton />}>
              <BillingPanel subscription={subscription} />
            </Suspense>
            {/* <Suspense fallback={<BillingInfoScheleton />}>
              <BillingInfoFetchZod subscription={subscription} />
            </Suspense> */}
            <UpdateBillingAddress subscription={subscription} />
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
