// @ts-nocheck
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

export default async function Page({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { q: searchValue, filter } = searchParams as {
    [key: string]: string
  }
  // filter=season8,production -> separated by comma
  const selectedFilters = filter
  const selectedFiltersArray = selectedFilters
    ? selectedFilters.split(',')
    : null

  const initial = await loadInitalPosts(selectedFiltersArray)
  // console.log('INITIAL', initial)

  const { initialPosts } = initial.data || {}

  // // const testFetch = await loadPosts()
  // // console.log('testFetch', testFetch)

  const initialPublishedAt = initialPosts[0].publishedAt
  const initialLastId = initialPosts[0]._id
  // console.log('initialPublishedAt', initialPublishedAt)
  // console.log('initialLastId', initialLastId)
  // const fetchfetch = await fetchPostsFromSanity({
  //   lastPublishedAt: initialPublishedAt,
  //   lastId: initialLastId
  // })
  // console.log('fetchfetch', fetchfetch)

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['infinite'],
    queryFn: () => {
      const results = loadPosts()
      return results
    }
  })
  // const edit = await getPosts()
  // console.log('queryClient', queryClient)
  // const products = await getProducts({ sortKey, reverse, query: searchValue });

  // search results will appear only in the dialog-> not in the grid in the browse page
  const results = await fetchData(searchValue)

  // console.log('initialResults', initialResults)

  // console.log('results', results)

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

  // When in Sanity Studio Draft Mode, we want to show the preview that differs from the live functionality
  if (draftMode().isEnabled) {
    // We want to fetch all posts as we will render them all in the preview (no infinite scroll)
    const initialPreview = await loadPosts()
    return <BrowsePagePreview initial={initialPreview} />
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrowsePage data={initial.data} isDraftMode={false} results={results} />
    </HydrationBoundary>
  )
}
