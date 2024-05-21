// @ts-nocheck
'use client'

import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useIntersection } from '@mantine/hooks'
import VideoTest from './VideoTest'
import { EpisodesSkeletonTwo } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'
// import { posts } from './postsTestData'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import type { EncodeDataAttributeCallback } from '@sanity/react-loader'

const numberOfItemsPerPage = 8

const fetchPostsFromSanity = async ({
  lastPublishedAt = undefined,
  lastId = undefined
}) => {
  const result = await client.fetch(
    groq`{"posts": *[_type == "post" && (
    publishedAt < $lastPublishedAt
    || (publishedAt == $lastPublishedAt && _id < $lastId)
  )] | order(publishedAt desc)  [0...${numberOfItemsPerPage}] {
    _id, title, publishedAt, "slug": slug.current,
  }}`,
    { lastPublishedAt, lastId }
  )

  if (result.length > 0) {
    lastPublishedAt = result.posts[result.posts.length - 1].publishedAt
    lastId = result.posts[result.posts.length - 1]._id
  } else {
    lastId = null // Reached the end
  }

  return result.posts
}
export interface ObservableGridProps {
  initialResults: any
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function ObservableGrid({
  initialResults,
  encodeDataAttribute
}: ObservableGridProps) {
  // v5 tanstack/react-query
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite'],
    // pass lastId and lastPublishedAt to the query function
    queryFn: ({ pageParam = {} }) => {
      return fetchPostsFromSanity(pageParam)
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length > 0) {
        const lastPost = lastPage[lastPage.length - 1]

        return { lastPublishedAt: lastPost.publishedAt, lastId: lastPost._id }
      }
      return undefined // Indicates there are no more pages to load
    },
    initialData: {
      pages: [initialResults],
      pageParams: [{}]
    }
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
                key={post.id}
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
      ))}
      {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
    </div>
  )
}
