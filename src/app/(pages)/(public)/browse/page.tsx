import { fetchData } from '@/app/common/fetching'

import { loadInitalPosts, loadPosts } from '@/sanity/loader/loadQuery'
import { draftMode } from 'next/headers'
import BrowsePage from './_components/BrowsePage'
import BrowsePagePreview from './_components/BrowsePagePreview'
import { redirect } from 'next/navigation'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate
} from '@tanstack/react-query'
import { fetchPostsFromSanity } from '@/utils/fetch-helpers'

export default async function Page() {
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
  const selectedFiltersArray = null
  const paginationParams = {
    lastPublishedAt: null,
    lastId: null,
    limit: 8
  }
  const initial = await loadInitalPosts(selectedFiltersArray, paginationParams)

  // I'll need a fetch function that:
  // 1. gets array of filters from the searchParams (optionally)
  // 2. gets the lastUpdatedAt and lastId as an object passed to it (optionally)

  // search results will appear only in the dialog-> not in the grid in the browse page
  // const results = await fetchData(searchValue)

  // When in Sanity Studio Draft Mode, we want to show the preview that differs from the live functionality
  if (draftMode().isEnabled) {
    // We want to fetch all posts as we will render them all in the preview (no infinite scroll)
    const initialPreview = await loadPosts()
    return <BrowsePagePreview initial={initialPreview} />
  }

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
