import {
  InitialPostsQueryResult,
  PostsByArtistSlugQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'

import { draftMode } from 'next/headers'

import { Suspense } from 'react'
import BrowsePageWrapper from '../../../_components/main/BrowsePageWrapper'
import Toolbar from '../../../_components/toolbar/Toolbar'
import DynamicDisplayBar from '../../../_components/main/DynamicDisplayBar'
import BrowsePreview from '../../../_components/main/BrowsePreview'
import ObservableGrid from '../../../_components/main/ObservableGrid'
import ArtistNavbar from '../../../_components/main/ArtistNavbar'

export interface BrowsePageProps {
  data: PostsByArtistSlugQueryResult | null
  previewData?: PostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
  isDraftMode?: boolean
}

export default async function ArtistPage({
  data,
  previewData,
  encodeDataAttribute,
  isDraftMode
}: BrowsePageProps) {
  // const { initialPosts } = data || {}
  // const { posts } = previewData || {}
  const { artistInfo } = data || {}
  const posts = artistInfo?.posts
  return (
    <>
      <Suspense>
        <BrowsePageWrapper>
          <div className="z-[10] sticky top-16 left-0 w-full lg:w-toolbarDesktop lg:fixed h-toolbar lg:top-auto lg:bottom-0   flex justify-between items-center text-xl  font-normal px-4 bg-white">
            <Toolbar />
          </div>
          <section className="h-dynamicDisplayBar min-h-dynamicDisplayBar z-[8]  lg:sticky top-0  left-0 bg-surface-brand">
            {/* <DynamicDisplayBar /> */}
            {artistInfo && <ArtistNavbar artistInfo={artistInfo} />}
          </section>
          <section data-listattr={true} className="lg:grow lg:mb-16 ">
            {artistInfo && (
              <Suspense>
                <ObservableGrid
                  data={artistInfo.posts}
                  encodeDataAttribute={encodeDataAttribute}
                  resultsPage={true}
                />
              </Suspense>
            )}
          </section>
        </BrowsePageWrapper>
      </Suspense>
    </>
  )
}
