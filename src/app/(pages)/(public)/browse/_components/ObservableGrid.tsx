// @ts-nocheck
import { EpisodesSkeletonTwo } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'

import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'

import {
  fetchPostsFromSanity,
  numberOfItemsPerPage
} from '@/utils/fetch-helpers'
import LoadMore from './LoadMore'
import { Suspense } from 'react'

export interface ObservableGridProps {
  data: InitialPostsQueryResult
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default async function ObservableGrid({
  data: dataProps,
  encodeDataAttribute
}: ObservableGridProps) {
  const { initialPosts } = dataProps || {}

  // console.log('initialPosts', initialPosts)

  const initialPublishedAt = initialPosts[initialPosts.length - 1].publishedAt
  const initialLastId = initialPosts[initialPosts.length - 1]._id

  return (
    <div className="lg:flex">
      {/* {data?.pages.map((page, i) => ( */}
      <>
        <div className=" grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0  screen-wide-short:grid-rows-1 ">
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
          <LoadMore initialPosts={initialPosts} />
        </div>
      </>
      {/* ))} */}
      {/* <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? <EpisodesSkeletonTwo /> : null}
      </button> */}
      {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
    </div>
  )
}
