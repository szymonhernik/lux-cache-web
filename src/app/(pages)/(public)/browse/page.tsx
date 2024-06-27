import 'server-only'
import { loadInitalPosts } from '@/sanity/loader/loadQuery'
// import { createClient } from '@/utils/supabase/server'

import BrowsePage from './_components/main/BrowsePage'
import { limitNumber } from '@/utils/fetch-helpers/client'

export default async function Page() {
  const paginationParams = {
    lastPublishedAt: null,
    lastId: null,
    limit: limitNumber
  }
  const initial = await loadInitalPosts(paginationParams)
  // const supabase = createClient()
  // const { data: subscription, error } = await supabase
  //   .from('subscriptions')
  //   .select('*, prices(*, products(*))')
  //   .in('status', ['trialing', 'active'])
  //   .maybeSingle()

  // When in Sanity Studio Draft Mode, we want to show the preview that differs from the live functionality
  // if (draftMode().isEnabled) {
  //   // We want to fetch all posts as we will render them all in the preview (no infinite scroll)
  //   const initialPreview = await loadPosts()
  //   return <BrowsePagePreview initial={initialPreview} />
  // }

  return <BrowsePage data={initial.data} isDraftMode={false} />
}

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

// const { q: searchValue, filter } = searchParams as {
//   [key: string]: string
// }
// filter=season8,production -> separated by comma
// const selectedFilters = filter
// const selectedFiltersArray = selectedFilters
//   ? selectedFilters.split(',')
//   : null
// const paginationParams = {
//   lastPublishedAt: null,
//   lastId: null,
//   limit: 8
// }
