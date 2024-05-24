// @ts-nocheck
'use client'

import { getPosts } from '@/utils/actions/getPosts'
import { SinglePostType } from '@/utils/types/sanity'
import { useInViewport } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import ListItem from './ListItem'
import { unstable_cache } from 'next/cache'

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
      // call api route to fetch more data
      // const cacheKey = `getPosts-${lastPublishedAt}-${lastId}`;
      try {
        getPosts(null, {
          lastPublishedAt,
          lastId,
          limit: 8
        }).then((res) => {
          const newInitialPosts = res.data?.initialPosts
          if (newInitialPosts && newInitialPosts.length > 0) {
            setLastPublishedAt(
              newInitialPosts[newInitialPosts.length - 1].publishedAt
            )
            setLastId(newInitialPosts[newInitialPosts.length - 1]._id)
          }
          setData((data) => ({
            posts: [...data.posts, ...newInitialPosts]
          }))
          //   console.log('newInitialPosts: ', newInitialPosts)
        })
      } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
      }
    }
  }, [inViewport])
  return (
    <>
      {data.posts.map((post) => (
        <div
          key={post._id}
          className="w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square"
        >
          <ListItem item={post} />
        </div>
      ))}
      <div ref={container}>load more</div>
    </>
  )
}
