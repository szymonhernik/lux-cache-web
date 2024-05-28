'use client'
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
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'
import LoadMoreTest from './LoadMoreTest'

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
  // render boolean from filters

  const [filtersOn, setFiltersOn] = useState<boolean>(false)
  //if filters value is NOT null, don't render from initialPosts but only from the fetch tanstack function

  return (
    <div className="lg:flex">
      <>
        <GridWrapperDiv>
          {!filters &&
            initialPosts.map((post, index) => {
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
          <LoadMoreTest initialPosts={initialPosts} />
        </GridWrapperDiv>

        {/* <LoadMore initialPosts={initialPosts} /> */}
      </>
    </div>
  )

  {
    /* <LoadMore initialPosts={initialPosts} /> */
  }
}
