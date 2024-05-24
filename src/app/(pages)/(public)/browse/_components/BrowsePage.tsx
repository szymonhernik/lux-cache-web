import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import DynamicDisplayBar from './DynamicDisplayBar'
import ObservableGridWrapper from './ObervableGridWrapper'
import ObservableGrid from './ObservableGrid'
import Toolbar from './Toolbar'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import DraftModeGrid from './DraftModeGrid'

export interface BrowsePageProps {
  data?: InitialPostsQueryResult | null
  previewData?: PostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
  isDraftMode?: boolean
  results?: any
}

export default function BrowsePage({
  data,
  previewData,
  encodeDataAttribute,
  isDraftMode,
  results
}: BrowsePageProps) {
  // const { initialPosts } = data || {}
  // const { posts } = previewData || {}
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
          {isDraftMode && previewData ? (
            <DraftModeGrid data={previewData} />
          ) : !isDraftMode && data ? (
            <ObservableGrid
              data={data}
              encodeDataAttribute={encodeDataAttribute}
            />
          ) : null}
        </section>
      </div>
      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
    </>
  )
}
