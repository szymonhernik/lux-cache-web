// @ts-nocheck
'use client'

import { getCachedPosts, getPosts } from '@/utils/actions/getPosts'
import { SinglePostType } from '@/utils/types/sanity'
import { useInViewport } from '@mantine/hooks'
import { Suspense, useEffect, useRef, useState } from 'react'
import ListItem from './ListItem'
import { unstable_cache } from 'next/cache'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { loadMorePosts } from '@/sanity/loader/loadQuery'
import { fetchMorePosts } from '@/utils/fetch-helpers/client'
import { GridWrapperDiv } from './GridWrapperDiv'
import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { useSearchParams } from 'next/navigation'

// Create a cached version of the getPosts function

export default function LoadMoreTest({
  initialPosts
}: {
  initialPosts?: SinglePostType[]
}) {
  const [dataPosts, setDataPosts] = useState({
    posts: []
  })
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') //
  //   filter=season8,production -> separated by comma

  const selectedFiltersArray = filter ? filter.split(',') : null

  const { ref: container, inViewport } = useInViewport()
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(
    initialPosts ? initialPosts[initialPosts.length - 1].publishedAt : null
  )
  const [lastId, setLastId] = useState<string | null>(
    initialPosts ? initialPosts[initialPosts.length - 1]._id : null
  )

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const r = await fetchMorePosts(selectedFiltersArray, {
        lastPublishedAt,
        lastId,
        limit: 8
      })
      // console.log('TANSTACK DATA: ', r)
      const newPosts = r as SinglePostType[]
      console.log('newPosts ', newPosts)
      if (newPosts && newPosts.length > 0) {
        setLastPublishedAt(newPosts[newPosts.length - 1].publishedAt)
        setLastId(newPosts[newPosts.length - 1]._id)
      }

      setDataPosts((prevData) => ({
        posts: [...prevData.posts, ...newPosts]
      }))
      const data = newPosts

      return data as SinglePostType[]
    },
    enabled: false
  })
  //   console.log('data: ', data)

  useEffect(() => {
    if (inViewport && !isLoading) {
      refetch()
    }
  }, [inViewport])

  return (
    <>
      {dataPosts.posts.map((post) => (
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
