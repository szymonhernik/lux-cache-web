import {
  getSubscription,
  getUser,
  getCanTrial,
  getCachedProducts
} from '@/utils/supabase/queries'
// import Pricing from './Pricing'
import { loadPrices } from '@/sanity/loader/loadQuery'
import { createClient } from '@/utils/supabase/server'
import PricingSimplified from './PricingSimplified'
import { unstable_cache } from 'next/cache'

export default async function PricingLayout() {
  const supabase = createClient()
  const [products] = await Promise.all([
    // getUser(supabase),
    getCachedProducts(supabase)
    // getSubscription(supabase),
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

  return (
    <PricingSimplified data={pricesDetails.data} products={products ?? []} />
    // <Pricing
    //   data={pricesDetails.data}
    //   user={user}
    //   products={products ?? []}
    //   subscription={subscription}
    //   userCanTrial={userCanTrial}
    // />
  )
}
