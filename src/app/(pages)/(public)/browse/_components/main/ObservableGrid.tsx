'use client'
import { EpisodeSkeletonListView } from '@/components/ui/skeletons/skeletons'
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
      className={clsx(' relative', {
        'overflow-x-hidden  lg:overflow-x-visible ': !view,
        'flex items-start': view === 'list'
      })}
    >
      <>
        {view === 'list' && (
          <div
            className={clsx(
              'hidden lg:block sticky top-dynamicDisplayBar ml-4 mr-8  bg-blue-200'
            )}
          >
            <Suspense fallback={<EpisodeSkeletonListView />}>
              <div
                className={` bg-gray-400 hidden lg:block w-full lg:w-[20vw] lg:max-w-72   aspect-square`}
              ></div>
            </Suspense>
          </div>
        )}

        <div
          className={clsx('lg:flex', {
            'lg:flex-col flex-grow': view === 'list'
          })}
        >
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
        </div>
      </>
    </div>
  )
}
