'use client'

import { PreviewVideoType, SinglePostType } from '@/utils/types/sanity'
import { useInViewport } from '@mantine/hooks'
import { Suspense, useEffect, useRef, useState } from 'react'
import ListItem from './ListItem'

import { useInfinitePost } from '@/utils/hooks/use-infinite-post'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'
import { limitNumber } from '@/utils/fetch-helpers/client'
import PostWrapper from './PostWrapper'

export default function LoadMore({
  initialPosts,
  view,
  onHover,
  userTier,
  isLoadingSubscriptions,
  onFirstFilteredPost,
  isDesktop,
  isTouchDevice
}: {
  initialPosts?: SinglePostType[]
  view: string | null
  onHover: (previewVideo: PreviewVideoType) => void
  userTier?: number
  isLoadingSubscriptions?: boolean
  onFirstFilteredPost?: (firstFilteredPost: PreviewVideoType) => void // Add this prop
  isDesktop: boolean
  isTouchDevice: boolean
}) {
  const { ref: loadMoreRef, inViewport } = useInViewport()

  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const selectedFiltersArray = filters ? filters.split(',') : null
  const lastStaticPost = initialPosts
    ? initialPosts[initialPosts.length - 1]
    : null

  const lastPublishedAt = lastStaticPost ? lastStaticPost.publishedAt : null

  const lastId = lastStaticPost ? lastStaticPost._id : null

  const { data, fetchNextPage, isFetchingNextPage } = useInfinitePost(
    selectedFiltersArray,
    lastPublishedAt,
    lastId,
    limitNumber
  )

  useEffect(() => {
    console.log('inViewport', inViewport)
    if (inViewport && !isFetchingNextPage && isDesktop) {
      console.log('Fetching new')
      fetchNextPage()
    }
  }, [inViewport])

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    if (isDesktop && data && data.pages.length > 0 && filters) {
      const firstPost = data.pages[0][0]

      if (onFirstFilteredPost && firstPost && firstPost.previewVideo) {
        onFirstFilteredPost(firstPost.previewVideo)
      }
    }
  }, [data, isDesktop])

  return (
    <>
      {data &&
        data.pages.map((page, index) => (
          <GridWrapperDiv key={index} view={view}>
            {page.map((post) => (
              <PostWrapper
                postPreviewVideo={post.previewVideo}
                postId={post._id}
                onHover={onHover}
                isDesktop={isDesktop}
              >
                <Suspense>
                  <ListItem
                    isDesktop={isDesktop}
                    isTouchDevice={isTouchDevice}
                    item={post}
                    isLoading={isLoadingSubscriptions}
                    userTier={userTier}
                  />
                </Suspense>
              </PostWrapper>
            ))}
          </GridWrapperDiv>
        ))}
      {/* if the last page in data has less than 8 results stop rendering load more  */}
      {data && data.pages[data.pages.length - 1].length < limitNumber ? (
        <p></p>
      ) : (
        <>
          <button
            ref={loadMoreRef}
            className="hidden lg:block w-full  items-center text-center hover:underline bg-surface-brand"
          >
            Loading...
          </button>

          <button
            onClick={handleLoadMore}
            className="bg-white lg:hidden w-full py-6 text-center hover:underline bg-gradient-to-b from-neutral-400"
          >
            Load more
          </button>
        </>
      )}
    </>
  )
}
