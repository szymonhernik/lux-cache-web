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
import clsx from 'clsx'
import PostWrapper from './PostWrapper'

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
  const view = searchParams.get('view')

  // if filters are present i don't want to render initial posts and load more should fetch first $limit posts without lastpublisheddate
  // if filters are NOT present i want to render initial posts and load more should fetch next $limit posts with lastpublisheddate
  return (
    <div
      className={clsx('lg:flex', {
        'flex-col ': view === 'list'
      })}
    >
      <>
        {!filters && (
          <>
            <GridWrapperDiv view={view}>
              {initialPosts.map((post, index) => {
                return (
                  <PostWrapper key={post._id}>
                    <Suspense fallback={<h1>Loading</h1>}>
                      <ListItem
                        item={post}
                        encodeDataAttribute={encodeDataAttribute}
                      />
                    </Suspense>
                  </PostWrapper>
                )
              })}
            </GridWrapperDiv>
            <LoadMore initialPosts={initialPosts} view={view} />
          </>
        )}
        {filters && <LoadMore />}
      </>
    </div>
  )
}
