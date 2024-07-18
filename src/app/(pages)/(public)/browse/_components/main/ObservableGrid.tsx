'use client'
import { EpisodeSkeletonListView } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'

import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'
import LoadMore from './LoadMore'
import clsx from 'clsx'
import PostWrapper from './PostWrapper'
import { createClient } from '@/utils/supabase/client'

import useSubscription from '@/utils/hooks/use-subscription-query'
import PreviewVideo from '../../../post/[slug]/_components/PreviewVideo'
import { useMediaQuery } from '@/utils/hooks/use-media-query'
import { PreviewVideoType } from '@/utils/types/sanity'

export interface ObservableGridProps {
  data: InitialPostsQueryResult['posts']
  encodeDataAttribute?: EncodeDataAttributeCallback
  resultsPage?: boolean
}

export default function ObservableGrid({
  data: dataProps,
  encodeDataAttribute,
  resultsPage
}: ObservableGridProps) {
  const initialPosts = dataProps || []
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const view = searchParams.get('view')
  const supabase = createClient()
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [activePreviewVideo, setActivePreviewVideo] = useState<any>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.expires_at) {
        setSessionExpiresAt(sessionData.session.expires_at)
      } else {
        return null
      }
    }
    getSession()
  }, [])

  const { data: userTier = 0, isLoading } = useSubscription(sessionExpiresAt)

  const handleHover = useCallback(
    (previewVideo: PreviewVideoType) => {
      if (isDesktop && view === 'list') {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }

        hoverTimeoutRef.current = setTimeout(() => {
          setActivePreviewVideo(previewVideo)
        }, 300)
      }
    },
    [isDesktop, view]
  )

  const handleFirstFilteredPost = useCallback(
    (previewVideoPassed: PreviewVideoType) => {
      if (previewVideoPassed && isDesktop && view === 'list') {
        setActivePreviewVideo(previewVideoPassed)
      }
    },
    [isDesktop, view]
  )

  useEffect(() => {
    if (!filters && isDesktop && view === 'list') {
      // set the hovered id to the first element from the initial posts
      if (initialPosts[0].previewVideo) {
        setActivePreviewVideo(initialPosts[0].previewVideo)
      }
    }
  }, [filters, isDesktop, view])

  // if filters are present i don't want to render initial posts and load more should fetch first $limit posts without lastpublisheddate
  // if filters are NOT present i want to render initial posts and load more should fetch next $limit posts with lastpublisheddate
  return (
    <div
      className={clsx(' relative', {
        'overflow-x-auto   ': !view,
        'flex items-start min-h-[100vh]': view === 'list'
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
                key={activePreviewVideo?._id}
                className={` bg-gray-400 hidden lg:block w-full lg:w-[20vw] lg:max-w-72   aspect-square`}
              >
                {/* {hoveredPostId} */}
                {activePreviewVideo && (
                  <PreviewVideo
                    key={activePreviewVideo.video.public_id}
                    previewVideo={activePreviewVideo}
                  />
                )}
              </div>
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
                  // console.log('post:', post._id)

                  return (
                    <PostWrapper
                      postPreviewVideo={post.previewVideo}
                      postId={post._id}
                      onHover={handleHover}
                      isDesktop={isDesktop}
                    >
                      <Suspense fallback={<h1>Loading</h1>}>
                        <ListItem
                          isDesktop={isDesktop}
                          item={post}
                          userTier={userTier}
                          isLoading={isLoading}
                          encodeDataAttribute={encodeDataAttribute}
                        />
                      </Suspense>
                    </PostWrapper>
                  )
                })}
              </GridWrapperDiv>
              {!resultsPage && (
                <LoadMore
                  initialPosts={initialPosts}
                  view={view}
                  userTier={userTier}
                  isLoadingSubscriptions={isLoading}
                  onHover={handleHover}
                  onFirstFilteredPost={handleFirstFilteredPost}
                  isDesktop={isDesktop}
                />
              )}
            </>
          )}
          {filters && !resultsPage && (
            <LoadMore
              view={view}
              userTier={userTier}
              isLoadingSubscriptions={isLoading}
              onHover={handleHover}
              onFirstFilteredPost={handleFirstFilteredPost}
              isDesktop={isDesktop}
            />
          )}
        </div>
      </>
    </div>
  )
}
