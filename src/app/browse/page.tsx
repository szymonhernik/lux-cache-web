import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import { ProductWithPrices } from '@/utils/types';
import { ProductMetadataSchema } from '@/utils/types/zod/types';
import Link from 'next/link';
import EpisodesContainer from './_components/EpisodesContainer';

export default async function BrowsePage() {
  // const supabase = createClient();

  // const {
  //   data: { user }
  // } = await supabase.auth.getUser();

  // const { data: subscription, error } = await supabase
  //   .from('subscriptions')
  //   .select('*, prices(*, products(*))')
  //   .in('status', ['trialing', 'active'])
  //   .maybeSingle();

  // if (error) {
  //   console.log(error);
  // }

  // const { data: products } = await supabase
  //   .from('products')
  //   .select('*, prices(*)')
  //   .eq('active', true)
  //   .eq('prices.active', true)
  //   .order('metadata->index')
  //   .order('unit_amount', { referencedTable: 'prices' });

  // const { data: userDetails } = await supabase
  //   .from('users')
  //   .select('can_trial')
  //   .single();

  return (
    <>
      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
      <EpisodesContainer />;
    </>
  );
}
