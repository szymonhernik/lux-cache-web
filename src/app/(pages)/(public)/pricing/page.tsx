import Pricing from '@/components/ui/Pricing/Pricing'
import { loadPrices } from '@/sanity/loader/loadQuery'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'
import { ProductMetadataSchema } from '@/utils/types/zod/types'

export default async function PricingPage() {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const pricesDetails = await loadPrices()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle()

  if (error) {
    console.log(error)
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' })

  const { data: userDetails } = await supabase
    .from('users')
    .select('can_trial')
    .single()

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
