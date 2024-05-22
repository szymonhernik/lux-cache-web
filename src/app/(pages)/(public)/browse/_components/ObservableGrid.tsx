'use client'

import { useEffect, useRef } from 'react'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useIntersection } from '@mantine/hooks'
import { EpisodesSkeletonTwo } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'
import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import { SinglePostType } from '@/utils/types/sanity'
import {
  fetchPostsFromSanity,
  numberOfItemsPerPage
} from '@/utils/fetch-helpers'
import {
  TData,
  TError,
  TPageParam,
  TQueryFnData,
  TQueryKey
} from '@/utils/types/tanstack'

export interface ObservableGridProps {
  data: InitialPostsQueryResult
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function ObservableGrid({
  data: dataProps,
  encodeDataAttribute
}: ObservableGridProps) {
  const { initialPosts } = dataProps || {}

  // v5 tanstack/react-query
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
      queryKey: ['infinite'],
      queryFn: ({ pageParam = {} }): Promise<TQueryFnData> => {
        return fetchPostsFromSanity(pageParam)
      },
      getNextPageParam: (lastPage) => {
        if (
          lastPage &&
          lastPage.length > 0 &&
          // If it's equal to the number of items per page then there might be more
          // if not, don't fetch more
          lastPage.length === numberOfItemsPerPage
        ) {
          const lastPost = lastPage[lastPage.length - 1]

          return {
            lastPublishedAt: lastPost.publishedAt!,
            lastId: lastPost._id
          }
        }
        return undefined // Indicates there are no more pages to load
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [{}]
      },
      initialPageParam: {}
    })

  const lastPostRef = useRef<HTMLElement>(null)

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0
  })

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry])

  return (
    <div className="lg:flex">
      {data?.pages.map((page, i) => (
        <>
          <div
            key={i}
            className=" grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0  screen-wide-short:grid-rows-1 "
          >
            {page.map((post, index) => {
              return index === page.length - 1 ? (
                <div
                  key={post._id}
                  className={`w-full lg:w-[calc((80vh-4rem)/2)]  screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
                  ref={ref}
                >
                  <ListItem
                    item={post}
                    encodeDataAttribute={encodeDataAttribute}
                  />
                </div>
              ) : (
                <div
                  key={post._id}
                  className={`w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
                >
                  <ListItem
                    item={post}
                    encodeDataAttribute={encodeDataAttribute}
                  />
                </div>
              )
            })}
          </div>
        </>
      ))}
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? <EpisodesSkeletonTwo /> : null}
      </button>
      {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
    </div>
  )
}
