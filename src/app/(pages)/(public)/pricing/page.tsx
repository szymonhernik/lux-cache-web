import Pricing from '@/components/ui/Pricing/Pricing'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'
import { ProductMetadataSchema } from '@/utils/types/zod/types'

export default async function PricingPage() {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

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

  // const trialProduct = products.find(product => {
  //   // find product that has metadata trial_allowed: true
  //   return product.metadata && product.metadata.trial_allowed;
  // }
  // console.log('trialProduct', trialProduct);

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
      userDetails={userDetails}
    />
  )
}
