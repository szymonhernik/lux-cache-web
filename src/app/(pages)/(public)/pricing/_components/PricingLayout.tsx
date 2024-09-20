import {
  getProducts,
  getSubscription,
  getUser,
  getUserDetails
} from '@/utils/supabase/queries'
import Pricing from './Pricing'
import { loadPrices } from '@/sanity/loader/loadQuery'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'
import { ProductMetadataSchema } from '@/utils/types/zod/types'

export default async function PricingLayout() {
  const supabase = createClient()
  const [user, products, subscription, userDetails] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
    getUserDetails(supabase)
  ])

  const pricesDetails = await loadPrices()

  return (
    <Pricing
      data={pricesDetails.data}
      user={user}
      products={products ?? []}
      subscription={subscription}
      userDetails={userDetails}
    />
  )
}
