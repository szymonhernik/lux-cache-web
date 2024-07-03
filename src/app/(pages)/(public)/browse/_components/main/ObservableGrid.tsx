'use client'
import { EpisodeSkeletonListView } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'

import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'
import LoadMore from './LoadMore'
import clsx from 'clsx'
import PostWrapper from './PostWrapper'
import { createClient } from '@/utils/supabase/client'

import useSubscription from '@/utils/hooks/use-subscription-query'

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
  // const { posts: initialPosts } = dataProps || {}
  const initialPosts = dataProps || []
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const view = searchParams.get('view')
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)

  const supabase = createClient()
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null)
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      //   @ts-ignore
      setSessionExpiresAt(data.session?.expires_at)
    }
    getSession()
  }, [])

  const { data, isLoading } = useSubscription(sessionExpiresAt)

  const userTier = data ? data : 0

  const handleHover = useCallback((postId: string | null) => {
    setHoveredPostId(postId)
  }, [])

  // if filters are present i don't want to render initial posts and load more should fetch first $limit posts without lastpublisheddate
  // if filters are NOT present i want to render initial posts and load more should fetch next $limit posts with lastpublisheddate
  return (
    <div
      className={clsx(' relative', {
        'overflow-x-auto   ': !view,
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
              >
                {hoveredPostId}
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
                    <PostWrapper postId={post._id} onHover={handleHover}>
                      <Suspense fallback={<h1>Loading</h1>}>
                        <ListItem
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
                />
              )}
            </>
          )}
          {filters && !resultsPage && (
            <LoadMore
              onHover={handleHover}
              view={view}
              userTier={userTier}
              isLoadingSubscriptions={isLoading}
            />
          )}
        </div>
      </>
    </div>
  )
}
