import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import DynamicDisplayBar from './DynamicDisplayBar'
import ObservableGridWrapper from './ObervableGridWrapper'
import ObservableGrid from './ObservableGrid'
import Toolbar from './Toolbar'
// import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'

export interface BrowsePageProps {
  data: InitialPostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function BrowsePage({
  data,
  encodeDataAttribute
}: BrowsePageProps) {
  const { initialPosts } = data || {}
  return (
    <>
      <div className=" flex flex-col lg:max-h-screen lg:h-screen bg-surface-brand">
        <div className="z-10 sticky top-16 left-0 w-full lg:w-toolbarDesktop lg:fixed h-toolbar lg:top-auto lg:bottom-0   flex justify-between items-center text-xl  font-normal px-4 bg-white">
          {/* <Toolbar results={results} /> */}
        </div>
        <section className="h-dynamicDisplayBar min-h-dynamicDisplayBar">
          <DynamicDisplayBar />
        </section>
        <section className="lg:grow lg:overflow-y-hidden lg:overflow-x-auto  lg:mb-16 ">
          <ObservableGridWrapper>
            <ObservableGrid
              initialResults={initialPosts}
              encodeDataAttribute={encodeDataAttribute}
            />
          </ObservableGridWrapper>
        </section>
      </div>
      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
    </>
  )
}
