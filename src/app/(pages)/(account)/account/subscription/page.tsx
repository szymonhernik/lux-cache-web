import BillingInfoFetchZod from '@/components/ui/AccountForms/BillingInfoFetchZod'
import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoSkeleton'
import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { getProducts, getSubscription, getUser } from '@/utils/supabase/queries'
import UpdateBillingAddress from './_components/billing/UpdateBillingAddress'
import DiscordIntegration from './_components/discord/DiscordIntegration'
import { getDiscordConnectionStatus } from './_components/discord/actions'
import { ENABLE_DISCORD_INTEGRATION } from '@/config/featureFlags'
import BillingPanel from './_components/billing/BillingPanel'
import SubscriptionManagementPanel from './_components/plans/SubscriptionManagementPanel'

export const dynamic = 'force-dynamic'

export default async function Page() {
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
