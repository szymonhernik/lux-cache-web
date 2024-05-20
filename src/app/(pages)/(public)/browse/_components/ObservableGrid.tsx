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

const numberOfItemsPerPage = 8
// let lastPublishedAt = ''
// let lastId = ''

const fetchPostsFromSanity = async ({ lastPublishedAt = '', lastId = '' }) => {
  const result = await client.fetch(
    groq`*[_type == "post" && (
    publishedAt > $lastPublishedAt
    || (publishedAt == $lastPublishedAt && _id > $lastId)
  )] | order(publishedAt) [0...${numberOfItemsPerPage}] {
    _id, title, publishedAt
  }`,
    { lastPublishedAt, lastId }
  )
  console.log('result', result)

  if (result.length > 0) {
    lastPublishedAt = result[result.length - 1].publishedAt
    lastId = result[result.length - 1]._id
  } else {
    lastId = null // Reached the end
  }

  return result
}

export default function ObservableGrid({
  initialResults
}: {
  initialResults: any
}) {
  // let lastPublishedAt = initialResults.data[initialResults.data.length - 1].publishedAt
  // let lastId = initialResults.data[initialResults.data.length - 1]._id

  // v5 tanstack/react-query
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['query'],
    // pass lastId and lastPublishedAt to the query function
    queryFn: ({ pageParam = {} }) => fetchPostsFromSanity(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length > 0) {
        const lastPost = lastPage[lastPage.length - 1]
        return { lastPublishedAt: lastPost.publishedAt, lastId: lastPost._id }
      }
      return undefined // Indicates there are no more pages to load
    },
    initialData: {
      pages: [initialResults.data],
      pageParams: [{}]
    }
    // initialPageParam: 1 // Set the initial page parameter, important when using initialData
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
          {page.map((post, index) =>
            index === page.length - 1 ? (
              <div
                key={post.id}
                className={`w-full lg:w-[calc((80vh-4rem)/2)]  screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
                ref={ref}
              >
                {/* <h1>{post.title}</h1> */}
                <ListItem item={post} />
              </div>
            ) : (
              <div
                key={post.id}
                className={`w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
              >
                {/* <h1>{post.title}</h1> */}
                <ListItem item={post} />
              </div>
            )
          )}
        </div>
      ))}
    </div>
  )
}
