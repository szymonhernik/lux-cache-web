import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import { ProductWithPrices } from '@/utils/types';
import { ProductMetadataSchema } from '@/utils/types/zod/types';
import Link from 'next/link';

export default async function PricingPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  const { data: userDetails } = await supabase
    .from('users')
    .select('can_trial')
    .single();

  // const trialProduct = products.find(product => {
  //   // find product that has metadata trial_allowed: true
  //   return product.metadata && product.metadata.trial_allowed;
  // }
  // console.log('trialProduct', trialProduct);

  return (
    <div className="">
      <p>
        Baking is a magical art that transforms simple ingredients into
        delectable treats that delight the senses. From the aroma of freshly
        baked bread wafting through the kitchen to the satisfying crunch of a
        perfectly crisp cookie, the joys of baking are endless. At its core,
        baking is a science, a precise dance of measurements and temperatures
        that, when executed with care and attention, yields mouthwatering
        results. But beyond the technical aspects, baking is also a deeply
        personal and creative endeavor, allowing us to express our individuality
        and share our love of food with others. Whether you're a seasoned baker
        or a novice just starting to explore the world of flour and sugar, the
        joy of baking lies in the process itself. The rhythmic kneading of
        dough, the careful folding of ingredients, and the anticipation of
        pulling a freshly baked creation from the oven – these are the moments
        that make baking such a rewarding and fulfilling pursuit. But baking is
        more than just a hobby; it's a way of life, a means of connecting with
        others and creating lasting memories. The act of sharing a homemade
        treat, whether it's a warm slice of bread or a decadent cake, is a
        universal language that transcends cultures and brings people together.
        So, let us celebrate the joys of baking, and embrace the magic that
        happens when we combine simple ingredients with our creativity and
        passion. For in the end, the true joy of baking lies not just in the
        final product, but in the journey itself.
      </p>
      <Link href="/pricing" className="">
        Link{' '}
      </Link>
    </div>
    // <Pricing
    //   user={user}
    //   products={products ?? []}
    //   subscription={subscription}
    //   userDetails={userDetails}
    // />
  );
}
