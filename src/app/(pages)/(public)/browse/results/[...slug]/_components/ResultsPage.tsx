import {
  PostsByArtistSlugQueryResult,
  PostsBySeriesSlugQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { Suspense } from 'react'
import BrowsePageWrapper from '../../../_components/main/BrowsePageWrapper'
import Toolbar from '../../../_components/toolbar/Toolbar'
import ObservableGrid from '../../../_components/main/ObservableGrid'
import ArtistNavbar from '../../../_components/main/ArtistNavbar'
import SeriesNavbar from '../../../_components/main/SeriesNavbar'

export interface BrowsePageProps {
  data: PostsByArtistSlugQueryResult | PostsBySeriesSlugQueryResult | null
  previewData?: PostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
  isDraftMode?: boolean
}

export default async function ResultsPage({
  data,
  encodeDataAttribute
}: BrowsePageProps) {
  const { results } = data || {}

  return (
    <>
      <Suspense>
        <BrowsePageWrapper>
          <div className="z-[10] sticky top-16 left-0 w-full lg:w-toolbarDesktop lg:fixed h-toolbar lg:top-auto lg:bottom-0   flex justify-between items-center text-xl  font-normal px-4 bg-white">
            <Toolbar resultsPage={true} />
          </div>
          <section className="h-dynamicDisplayBar min-h-dynamicDisplayBar z-[8]  lg:sticky top-0  left-0 bg-surface-brand">
            {/* {artistContent}
            {seriesContent} */}
            {results?._type === 'artist' ? (
              <ArtistNavbar results={results} />
            ) : results?._type === 'series' ? (
              <SeriesNavbar results={results} />
            ) : null}
          </section>
          <section data-listattr={true} className="lg:grow lg:mb-16 ">
            {results?.posts && (
              <Suspense>
                <ObservableGrid
                  data={results.posts}
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
