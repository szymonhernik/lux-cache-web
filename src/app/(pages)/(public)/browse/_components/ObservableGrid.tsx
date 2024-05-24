// @ts-nocheck
'use client'

import { use, useEffect, useRef } from 'react'
import {
  InfiniteData,
  QueryObserver,
  useInfiniteQuery,
  useQueryClient
} from '@tanstack/react-query'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { loadPosts } from '@/sanity/loader/loadQuery'

export interface ObservableGridProps {
  data: InitialPostsQueryResult
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function ObservableGrid({
  data: dataProps,
  encodeDataAttribute
}: ObservableGridProps) {
  const { initialPosts } = dataProps || {}

  const initialPublishedAt = initialPosts[initialPosts.length - 1].publishedAt
  const initialLastId = initialPosts[initialPosts.length - 1]._id

  // console.log('initialPosts', initialPosts)
  // console.log('queryClient', queryClient)

  // v5 tanstack/react-query
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>({
      queryKey: ['infinite'],
      queryFn: ({ pageParam }) => {
        const results = fetchPostsFromSanity(pageParam)
        return results
      },

      getNextPageParam: (lastPage) => {
        if (
          lastPage &&
          lastPage.length > 0 &&
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

      initialPageParam: {
        // lastPublishedAt: initialPublishedAt,
        // lastId: initialLastId
      }
    })

  // initialData: {
  //   // pages: [filtersArray ? serverActionFetch(filtersArray) : initialPosts],
  //   pages: [initialPosts],
  //   pageParams: [{}]
  // },

  // const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
  //   useInfiniteQuery({
  //     queryKey: ['infinite'],
  //     queryFn: async () => {
  //       const r = await fetchPostsSimple()
  //       console.log('r', r)
  //       return r
  //     },
  //     // gcTime: 0,
  //     getNextPageParam: (lastPage, allPages) => {},
  //     // initialData: {
  //     //   // pages: [filtersArray ? serverActionFetch(filtersArray) : initialPosts],
  //     //   pages: [initialPosts],
  //     //   pageParams: [{}]
  //     // },
  //     initialPageParam: 1
  //   })

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
