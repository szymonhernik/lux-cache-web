'use client'

import { SinglePostType } from '@/utils/types/sanity'
import { useInViewport } from '@mantine/hooks'
import { Suspense, useEffect, useRef, useState } from 'react'
import ListItem from './ListItem'
import { unstable_cache } from 'next/cache'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { loadMorePosts } from '@/sanity/loader/loadQuery'

import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { useInfinitePost } from '@/utils/hooks/use-infinite-post'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'
import { limitNumber } from '@/utils/fetch-helpers/client'
import PostWrapper from './PostWrapper'

export default function LoadMore({
  initialPosts,
  view
}: {
  initialPosts?: SinglePostType[]
  view?: string | null
}) {
  const { ref: container, inViewport } = useInViewport()

  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const selectedFiltersArray = filters ? filters.split(',') : null
  const lastStaticPost = initialPosts
    ? initialPosts[initialPosts.length - 1]
    : null

  const lastPublishedAt = lastStaticPost ? lastStaticPost.publishedAt : null

  const lastId = lastStaticPost ? lastStaticPost._id : null

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isLoading
  } = useInfinitePost(
    selectedFiltersArray,
    lastPublishedAt,
    lastId,
    limitNumber
  )

  useEffect(() => {
    if (inViewport && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inViewport])

  return (
    <>
      {data &&
        data.pages.map((page, index) => (
          <GridWrapperDiv key={index} view={view}>
            {page.map((post) => (
              <PostWrapper key={post._id}>
                <Suspense>
                  <ListItem item={post} />
                </Suspense>
              </PostWrapper>
            ))}
          </GridWrapperDiv>
        ))}
      {/* if the last page in data has less than 8 results stop rendering load more  */}
      {data && data.pages[data.pages.length - 1].length < limitNumber ? (
        <div className="text-center">No more posts to load</div>
      ) : (
        <div ref={container}>load more</div>
      )}
    </>
  )
}
