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

import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { useInfinitePost } from '@/utils/hooks/use-infinite-post'
import { useSearchParams } from 'next/navigation'
import { GridWrapperDiv } from './GridWrapperDiv'

// Create a cached version of the getPosts function

export default function LoadMore({
  initialPosts
}: {
  initialPosts?: SinglePostType[]
}) {
  const { ref: container, inViewport } = useInViewport()

  const searchParams = useSearchParams()
  const filters = searchParams.get('filter') //
  const selectedFiltersArray = filters ? filters.split(',') : null

  const [lastPublishedAt, setLastPublishedAt] = useState<string>(
    initialPosts[initialPosts.length - 1].publishedAt
  )
  const [lastId, setLastId] = useState<string>(
    initialPosts[initialPosts.length - 1]._id
  )

  useEffect(() => {
    if (filters) {
      setLastPublishedAt(null)
      setLastId(null)
      console.log('SHOULD SET TO NULL')
    } else {
      setLastPublishedAt(initialPosts[initialPosts.length - 1].publishedAt)
      setLastId(initialPosts[initialPosts.length - 1]._id)
      console.log('SHOULD SET TO INITIAL POSTS')
      // refetch()
    }
  }, [searchParams])

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isLoading
  } = useInfinitePost(selectedFiltersArray, lastPublishedAt, lastId, 8)

  useEffect(() => {
    if (inViewport && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inViewport])

  return (
    <>
      {data &&
        data.pages.map((page, index) => (
          <GridWrapperDiv key={index}>
            {page.map((post) => (
              <div
                key={post._id}
                className="w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square"
              >
                <Suspense>
                  <ListItem item={post} />
                </Suspense>
              </div>
            ))}
          </GridWrapperDiv>
        ))}
      <div ref={container}>load more</div>
    </>
  )

  // return (
  //   <>
  //     {dataPosts.posts.map((post) => (
  //       <div
  //         key={post._id}
  //         className="w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square"
  //       >
  //         <Suspense>
  //           <ListItem item={post} />
  //         </Suspense>
  //       </div>
  //     ))}
  //     <div ref={container}>load more</div>
  //   </>
  // )
}

// useEffect(() => {
//   if (inViewport) {
//     getCachedPosts({
//       lastPublishedAt,
//       lastId,
//       limit: 8
//     })
//       .then((res) => {
//         const newInitialPosts = res.data?.initialPosts
//         if (newInitialPosts && newInitialPosts.length > 0) {
//           setLastPublishedAt(
//             newInitialPosts[newInitialPosts.length - 1].publishedAt
//           )
//           setLastId(newInitialPosts[newInitialPosts.length - 1]._id)
//         }
//         setData((prevData) => ({
//           posts: [...prevData.posts, ...newInitialPosts]
//         }))
//       })
//       .catch((error) => {
//         console.error(`An error happened: ${error}`)
//       })
//   }
// }, [inViewport])
