import {
  getSubscription,
  getUser,
  getCanTrial,
  getCachedProducts
} from '@/utils/supabase/queries'
// import Pricing from './Pricing'
import { loadPrices } from '@/sanity/loader/loadQuery'
import { createClient } from '@/utils/supabase/server'
// import PricingSimplified from './PricingSimplified'
import { unstable_cache } from 'next/cache'
import PricingEmbed from './PricingEmbed'
import PricingSimplified from './PricingSimplified'

export default async function PricingLayout() {
  const supabase = createClient()
  const [products, subscription] = await Promise.all([
    // getUser(supabase),
    getCachedProducts(supabase),
    getSubscription(supabase)
    // getCanTrial(supabase)
  ])

  const getCachedPricesDetails = unstable_cache(
    async () => {
      return await loadPrices()
    },
    ['pricing-details'],
    {
      tags: [`pricing-details`]
    }
  )

  const pricesDetails = await getCachedPricesDetails()
  const isEmbeddedCheckoutEnabled =
    process.env.NEXT_PUBLIC_STRIPE_EMBEDDED_CHECKOUT_ENABLED === 'true'

  if (isEmbeddedCheckoutEnabled) {
    return (
      <PricingEmbed
        data={pricesDetails.data}
        products={products ?? []}
        subscription={subscription}
      />
    )
  } else {
    return (
      <PricingSimplified data={pricesDetails.data} products={products ?? []} />
    )
  }
}
