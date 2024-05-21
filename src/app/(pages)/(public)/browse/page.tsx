import { fetchData } from '@/app/common/fetching'

import { loadInitalPosts } from '@/sanity/loader/loadQuery'
import { draftMode } from 'next/headers'
import BrowsePage from './_components/BrowsePage'
import BrowsePagePreview from './_components/BrowsePagePreview'

export default async function Page({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { q: searchValue } = searchParams as { [key: string]: string }
  // const products = await getProducts({ sortKey, reverse, query: searchValue });
  const results = await fetchData(searchValue)

  const initial = await loadInitalPosts()

  // const initialResults = await loadInitalPosts()

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

  if (draftMode().isEnabled) {
    return <BrowsePagePreview initial={initial} />
  }

  return <BrowsePage data={initial.data} />
}
