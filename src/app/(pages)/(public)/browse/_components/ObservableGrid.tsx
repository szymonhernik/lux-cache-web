'use client'

import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useIntersection } from '@mantine/hooks'
import VideoTest from './VideoTest'
import { EpisodesSkeletonTwo } from '@/components/ui/skeletons/skeletons'
import ListItem from './ListItem'
import { posts } from './postsTestData'

const numberOfItemsPerPage = 10

const fetchPostMock = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return posts.slice(
    (page - 1) * numberOfItemsPerPage,
    page * numberOfItemsPerPage
  )
}

export default function ObservableGrid() {
  // v5 tanstack/react-query
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['query'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchPostMock(pageParam)
      return response
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1
    },
    initialData: {
      pages: [posts.slice(0, numberOfItemsPerPage)],
      pageParams: [1]
    },
    initialPageParam: 1 // Set the initial page parameter, important when using initialData
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
          className=" grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0  screen-wide-short:grid-rows-1 lg:w-max"
        >
          {page.map((post, index) =>
            index === page.length - 1 ? (
              <div
                key={post.id}
                className={`w-full lg:w-[calc((80vh-4rem)/2)]  screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
                ref={ref}
              >
                <ListItem item={post} />
              </div>
            ) : (
              <div
                key={post.id}
                className={`w-full lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)] aspect-square `}
              >
                <ListItem item={post} />
              </div>
            )
          )}
        </div>
      ))}
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? (
          <EpisodesSkeletonTwo />
        ) : (data?.pages.length ?? 0) < posts.length / numberOfItemsPerPage ? (
          <EpisodesSkeletonTwo />
        ) : null
        // <div className="h-full  flex items-center bg-black text-white text-xs p-16 w-max">
        //   <span> Nothing more to load</span>
        // </div>
        }
      </button>
    </div>
  )
}
