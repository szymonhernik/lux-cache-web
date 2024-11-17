import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoSkeleton'
import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  getCachedProducts,
  getDiscordConnectionStatus,
  getSubscription,
  getUser
} from '@/utils/supabase/queries'

import { ENABLE_DISCORD_INTEGRATION } from '@/config/featureFlags'
import DiscordIntegration from './discord/DiscordIntegration'
import SubscriptionManagementPanel from './plans/SubscriptionManagementPanel'
import BillingPanel from './billing/BillingPanel'
// import UpdateBillingAddress from './billing/UpdateBillingAddress'
import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm'
import Card from '@/components/ui/Card'
import { stripe } from '@/utils/stripe/config'

export const dynamic = 'force-dynamic'

export default async function SubscriptionLayout() {
  const supabase = createClient()

  const [user, products, subscription, discordConnectionStatusResult] =
    await Promise.all([
      getUser(supabase),
      getCachedProducts(supabase),
      getSubscription(supabase),
      ENABLE_DISCORD_INTEGRATION
        ? getDiscordConnectionStatus(supabase)
        : Promise.resolve(null)
    ])

  // const subscriptionFromStripe = await stripe.subscriptions.retrieve(
  //   'sub_1QMAKUC5Vnk6f7u9BIrX3Jgc',
  //   { expand: ['discounts'] }
  // )
  // const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  //   customer: 'cus_REdbYFJw5590XU'
  // })
  // // console.log('subscriptionFromStripe', subscriptionFromStripe)
  // console.log('upcomingInvoice', upcomingInvoice)

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
          </>
        ) : (
          <Card title="Plan type">
            <div
              className={`border p-4 rounded-md bg-secondary flex justify-between`}
            >
              <p className="font-semibold ">You have no active subscription</p>
              <Link href="/pricing" className="underline">
                Subscribe
              </Link>
            </div>
          </Card>
        )}
        <CustomerPortalForm subscription={subscription} />
      </div>
    </>
  )
}
