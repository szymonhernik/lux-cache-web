import { getSubscription, getCachedProducts } from '@/utils/supabase/queries'
// import Pricing from './Pricing'
import { loadPrices } from '@/sanity/loader/loadQuery'
import { createClient } from '@/utils/supabase/server'
// import PricingSimplified from './PricingSimplified'
import { unstable_cache } from 'next/cache'
import PricingEmbed from './PricingEmbed'

export default async function PricingLayout() {
  const supabase = createClient()
  const [products, subscription] = await Promise.all([
    getCachedProducts(supabase),
    getSubscription(supabase)
  ])

  const getCachedPricesDetails = unstable_cache(
    async () => {
      return await loadPrices()
    },
    ['pricing-details'],
    {
      tags: [`pricing-details-v2`]
    }
  )

  const pricesDetails = await getCachedPricesDetails()

  return (
    <PricingEmbed
      data={pricesDetails.data}
      products={products ?? []}
      subscription={subscription}
    />
  )
}
