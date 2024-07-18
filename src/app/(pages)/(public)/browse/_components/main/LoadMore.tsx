'use client'

import { PreviewVideoType, SinglePostType } from '@/utils/types/sanity'
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
import {
  EpisodeSkeleton,
  EpisodeSkeletonListView,
  EpisodesSkeletonTwo
} from '@/components/ui/skeletons/skeletons'

export default function LoadMore({
  initialPosts,
  view,
  onHover,
  userTier,
  isLoadingSubscriptions,
  onFirstFilteredPost,
  isDesktop
}: {
  initialPosts?: SinglePostType[]
  view: string | null
  onHover: (previewVideo: PreviewVideoType) => void
  userTier?: number
  isLoadingSubscriptions?: boolean
  onFirstFilteredPost?: (firstFilteredPost: PreviewVideoType) => void // Add this prop
  isDesktop: boolean
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
    // console.log('isFetchingNextPage', isFetchingNextPage)
    // console.log('isFetching', isFetching)
    // console.log('isLoading', isLoading)

    if (inViewport && !isFetchingNextPage && isDesktop) {
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
      ) : isFetchingNextPage ? (
        <>
          {/* <EpisodeSkeletonListView /> */}
          <div className=" flex flex-col ">
            {/* <div className=" grow bg-blue-500 h-[calc((80vh-4rem)/2)] w-[calc((80vh-4rem)/2)]"> */}
            <EpisodeSkeleton />
            {/* </div> */}
            {/* <div className="  grow bg-blue-200 h-[calc((80vh-4rem)/2)] w-[calc((80vh-4rem)/2)]"> */}{' '}
            <div className="screen-wide-short:hidden">
              <EpisodeSkeleton />
            </div>
            {/* </div> */}
          </div>
        </>
      ) : (
        <>
          <button
            ref={container}
            className="  hidden lg:block w-full items-center text-center hover:underline bg-surface-brand"
          >
            Load more
          </button>

          <button
            onClick={handleLoadMore}
            className="bg-white lg:hidden w-full py-6 text-center hover:underline bg-gradient-to-b from-neutral-400"
          >
            Load more
          </button>
        </>
      )}
      {/* {data &&
      data.pages[data.pages.length - 1].length <
        limitNumber ? null : isLoading || isFetchingNextPage ? ( // <div className="text-center">No more posts to load</div>
        // <div>Loading...</div>
        // <div></div>
        <EpisodesSkeletonTwo />
      ) : (
        <>
          <button
            onClick={handleLoadMore}
            className="bg-white lg:hidden w-full py-6 text-center hover:underline bg-gradient-to-b from-neutral-400"
          >
            Load more
          </button>
          <button
            ref={container}
            className="bg-white hidden lg:block w-full py-6 text-center hover:underline bg-gradient-to-b from-neutral-400"
          >
            Load more
          </button>
        </>
      )} */}
    </>
  )
}
