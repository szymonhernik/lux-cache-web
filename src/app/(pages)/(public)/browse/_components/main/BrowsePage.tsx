import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import DynamicDisplayBar from './DynamicDisplayBar'
import ObservableGrid from './ObservableGrid'
import Toolbar from '../toolbar/Toolbar'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import DraftModeGrid from './draftmode/DraftModeGrid'
import { draftMode } from 'next/headers'
import BrowsePreview from './BrowsePreview'
import { Suspense } from 'react'
import BrowsePageWrapper from './BrowsePageWrapper'

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
      <Suspense>
        <BrowsePageWrapper>
          <div className="z-10 sticky top-16 left-0 w-full lg:w-toolbarDesktop lg:fixed h-toolbar lg:top-auto lg:bottom-0   flex justify-between items-center text-xl  font-normal px-4 bg-white">
            <Toolbar />
          </div>
          <section className="h-dynamicDisplayBar min-h-dynamicDisplayBar z-[10] sticky top-0 left-0 bg-surface-brand">
            <DynamicDisplayBar />
          </section>
          <section data-listattr={true} className="lg:grow lg:mb-16 ">
            {draftMode().isEnabled ? (
              <BrowsePreview />
            ) : !draftMode().isEnabled && data ? (
              <Suspense>
                <ObservableGrid
                  data={data}
                  encodeDataAttribute={encodeDataAttribute}
                />
              </Suspense>
            ) : null}
          </section>
        </BrowsePageWrapper>
      </Suspense>
      {/* <div className="h-56 w-full bg-pink-100">Highlighted element</div> */}
    </>
  )
}
