import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import DynamicDisplayBar from './DynamicDisplayBar'
import ObservableGrid from './ObservableGrid'
import Toolbar from '../toolbar/Toolbar'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { draftMode } from 'next/headers'
import BrowsePreview from './BrowsePreview'
import { Suspense } from 'react'
import BrowsePageWrapper from './BrowsePageWrapper'
import { LoadingSpinner } from '@/components/Spinner'

export interface BrowsePageProps {
  data?: InitialPostsQueryResult | null
  previewData?: PostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
  isDraftMode?: boolean
}

export default async function BrowsePage({
  data,
  previewData,
  encodeDataAttribute,
  isDraftMode
}: BrowsePageProps) {
  // const { initialPosts } = data || {}
  // const { posts } = previewData || {}
  return (
    <>
      <BrowsePageWrapper>
        <section className="h-40 lg:h-dynamicDisplayBar lg:min-h-dynamicDisplayBar z-[8]  lg:sticky top-0  left-0 bg-surface-brand">
          {data && <DynamicDisplayBar data={data.highlight} />}
        </section>
        <div className="z-[10] sticky top-16 left-0 w-full lg:w-toolbarDesktop  h-toolbar  lg:top-dynamicDisplayBar   flex justify-between items-center text-xl  font-normal px-4 bg-white">
          <Toolbar />
        </div>
        <section data-listattr={true} className="lg:grow  ">
          {draftMode().isEnabled ? (
            <BrowsePreview />
          ) : !draftMode().isEnabled && data ? (
            <Suspense>
              <ObservableGrid
                data={data.posts}
                // key={Math.random()}
                encodeDataAttribute={encodeDataAttribute}
              />
            </Suspense>
          ) : null}
        </section>
      </BrowsePageWrapper>

      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
    </>
  )
}
