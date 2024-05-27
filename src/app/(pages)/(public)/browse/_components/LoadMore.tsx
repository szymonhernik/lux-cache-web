// @ts-nocheck
'use client'

import { getCachedPosts, getPosts } from '@/utils/actions/getPosts'
import { SinglePostType } from '@/utils/types/sanity'
import { useInViewport } from '@mantine/hooks'
import { Suspense, useEffect, useRef, useState } from 'react'
import ListItem from './ListItem'
import { unstable_cache } from 'next/cache'

// Create a cached version of the getPosts function

export default function LoadMore({
  initialPosts
}: {
  initialPosts: SinglePostType[]
}) {
  const [data, setData] = useState({
    posts: []
  })
  const { ref: container, inViewport } = useInViewport()
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(
    initialPosts[initialPosts.length - 1].publishedAt
  )
  const [lastId, setLastId] = useState<string | null>(
    initialPosts[initialPosts.length - 1]._id
  )

  useEffect(() => {
    if (inViewport) {
      getCachedPosts({
        lastPublishedAt,
        lastId,
        limit: 8
      })
        .then((res) => {
          const newInitialPosts = res.data?.initialPosts
          if (newInitialPosts && newInitialPosts.length > 0) {
            setLastPublishedAt(
              newInitialPosts[newInitialPosts.length - 1].publishedAt
            )
            setLastId(newInitialPosts[newInitialPosts.length - 1]._id)
          }
          setData((prevData) => ({
            posts: [...prevData.posts, ...newInitialPosts]
          }))
        })
        .catch((error) => {
          console.error(`An error happened: ${error}`)
        })
    }
  }, [inViewport])
  return (
    <>
      {data.posts.map((post) => (
        <div
          key={post._id}
          className="w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square"
        >
          <Suspense>
            <ListItem item={post} />
          </Suspense>
        </div>
      ))}
      <div ref={container}>load more</div>
    </>
  )
}
