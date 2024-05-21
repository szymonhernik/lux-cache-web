import ObservableGrid from './_components/ObservableGrid'

import ObservableGridWrapper from './_components/ObervableGridWrapper'
import Toolbar from './_components/Toolbar'
import DynamicDisplayBar from './_components/DynamicDisplayBar'
import { fetchData } from '@/app/common/fetching'

import { loadInitalPosts } from '@/sanity/loader/loadQuery'

export default async function BrowsePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { q: searchValue } = searchParams as { [key: string]: string }
  // const products = await getProducts({ sortKey, reverse, query: searchValue });
  const results = await fetchData(searchValue)

  const initialResults = await loadInitalPosts()

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

  return (
    <>
      <div className=" flex flex-col lg:max-h-screen lg:h-screen bg-surface-brand">
        <div className="z-10 sticky top-16 left-0 w-full lg:w-toolbarDesktop lg:fixed h-toolbar lg:top-auto lg:bottom-0   flex justify-between items-center text-xl  font-normal px-4 bg-white">
          <Toolbar results={results} />
        </div>
        <section className="h-dynamicDisplayBar min-h-dynamicDisplayBar">
          <DynamicDisplayBar />
        </section>
        <section className="lg:grow lg:overflow-y-hidden lg:overflow-x-auto  lg:mb-16 ">
          <ObservableGridWrapper>
            <ObservableGrid initialResults={initialResults} />
          </ObservableGridWrapper>
        </section>
      </div>
      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
    </>
  )
}
