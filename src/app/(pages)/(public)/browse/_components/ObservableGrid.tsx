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

const fetchPostsFromSanity = async ({
  lastPublishedAt = undefined,
  lastId = undefined
}) => {
  console.log(
    'inside of fetchPostsFromSanity, lastPublishedAt',
    lastPublishedAt
  )

  const result = await client.fetch(
    groq`*[_type == "post" && (
    publishedAt < $lastPublishedAt
    || (publishedAt == $lastPublishedAt && _id < $lastId)
  )] | order(publishedAt desc)  [0...${numberOfItemsPerPage}] {
    _id, title, publishedAt
  }`,
    { lastPublishedAt, lastId }
  )
  // first result looks OK follows correct order and in sync with initialResults
  // console.log('result', result)

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
  const initialLastPublishedAt =
    initialResults.data[initialResults.data.length - 1].publishedAt
  const initialLastId = initialResults.data[initialResults.data.length - 1]._id

  // console.log('initialLastPublishedAt', initialLastPublishedAt)
  // console.log('initialLastId', initialLastId)
  // console.log('initialResults', initialResults.data)

  // v5 tanstack/react-query
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite'],
    // pass lastId and lastPublishedAt to the query function
    queryFn: ({ pageParam = {} }) => {
      // console.log('pageParam', pageParam)
      return fetchPostsFromSanity(pageParam)
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length > 0) {
        console.log('lastPage', lastPage)
        // console.log(
        //   'lastPublishedAt: ',
        //   lastPage[lastPage.length - 1].publishedAt
        // )
        // console.log('lastId: ', lastPage[lastPage.length - 1]._id)

        const lastPost = lastPage[lastPage.length - 1]
        // console.log('lastPost', lastPost)

        return { lastPublishedAt: lastPost.publishedAt, lastId: lastPost._id }
      }
      return undefined // Indicates there are no more pages to load
    },
    initialData: {
      pages: [initialResults.data],
      pageParams: [
        {}
        // { lastPublishedAt: initialLastPublishedAt, lastId: initialLastId }
      ]
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

  // console.log('data.pages', data.pages)

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
      {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
    </div>
  )
}
