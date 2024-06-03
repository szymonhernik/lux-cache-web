'use client'
import { EpisodesSkeletonTwo } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'

import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'
import LoadMore from './LoadMore'

export interface ObservableGridProps {
  data: InitialPostsQueryResult
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function ObservableGrid({
  data: dataProps,
  encodeDataAttribute
}: ObservableGridProps) {
  const { posts: initialPosts } = dataProps || {}
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')

  // if filters are present i don't want to render initial posts and load more should fetch first $limit posts without lastpublisheddate
  // if filters are NOT present i want to render initial posts and load more should fetch next $limit posts with lastpublisheddate
  return (
    <div className="lg:flex">
      <>
        {!filters && (
          <>
            <GridWrapperDiv>
              {initialPosts.map((post, index) => {
                return (
                  <div
                    key={post._id}
                    className={`w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
                  >
                    <Suspense>
                      <ListItem
                        item={post}
                        encodeDataAttribute={encodeDataAttribute}
                      />
                    </Suspense>
                  </div>
                )
              })}
            </GridWrapperDiv>
            <LoadMore initialPosts={initialPosts} />
          </>
        )}
        {filters && <LoadMore />}
      </>
    </div>
  )
}
