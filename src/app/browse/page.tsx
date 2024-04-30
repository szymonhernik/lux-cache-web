import Pricing from '@/components/ui/Pricing/Pricing'
import { createClient } from '@/utils/supabase/server'
import { ProductWithPrices } from '@/utils/types'
import { ProductMetadataSchema } from '@/utils/types/zod/types'
import Link from 'next/link'
import EpisodesContainer from './_components/EpisodesContainer'
import ObservableGrid from './_components/ObservableGrid'

import ObservableGridWrapper from './_components/ObervableGridWrapper'
import Search from '@/components/icons/Search'

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
      <div className="flex flex-col lg:max-h-screen lg:h-screen">
        <div className="sticky top-16 left-0 w-full lg:w-toolbarDesktop lg:fixed h-toolbar lg:top-auto lg:bottom-0   flex justify-between items-center text-xl  font-normal px-4">
          <div>
            <button aria-label="Filter">Filter</button>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Switch View" className="opacity-70">
              View
            </button>
            <div>
              <button aria-label="Search" className="flex items-center">
                <Search />
                Search
              </button>
            </div>
          </div>
        </div>
        <section className="h-highlightBar min-h-highlightBar  p-4 uppercase bg-surface-brand">
          Highlight
        </section>
        <section className="lg:grow lg:overflow-y-hidden lg:overflow-x-auto  lg:mb-16 ">
          <ObservableGridWrapper>
            <ObservableGrid />
          </ObservableGridWrapper>
        </section>
      </div>
      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
    </>
  )
}
