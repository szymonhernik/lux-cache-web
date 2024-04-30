'use client'

import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useIntersection } from '@mantine/hooks'
import VideoTest from './VideoTest'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import EpisodeSkeleton from './EpisodeSkeleton'

const posts = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  content: `Item ${index + 1}`
}))

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

  // useEffect(() => {
  //   if (entry?.isIntersecting) fetchNextPage()
  // }, [entry])

  return (
    <div className="lg:flex">
      {data?.pages.map((page, i) => (
        <div
          key={i}
          className=" grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0  wide-short:grid-rows-1"
        >
          {page.map((post, index) =>
            index === page.length - 1 ? (
              <div
                key={post.id}
                className={`w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square `}
                ref={ref}
              >
                <ListItem item={post} />
              </div>
            ) : (
              <div
                key={post.id}
                className={`w-full lg:w-[calc((80vh-4rem)/2)] wide-short:w-[calc(80vh-4rem)] aspect-square `}
              >
                <ListItem item={post} />
              </div>
            )
          )}
        </div>
      ))}
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage ? (
          <>
            <Skeleton className="bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square " />
            <Skeleton className="bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square delay-200" />
          </>
        ) : (data?.pages.length ?? 0) < posts.length / numberOfItemsPerPage ? (
          <>
            <Skeleton className="bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square " />
            <Skeleton className="bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square delay-200" />
          </>
        ) : (
          'Nothing more to load'
        )}
      </button>
    </div>
  )
}

function ListItem({ item }: { item: { id: number; content: string } }) {
  const { ref, entry } = useIntersection({
    threshold: 0.0, // Customize the threshold as needed
    rootMargin: '100px 0%'
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      console.log(`Item ${item.id} is in view.`)
      // You could dispatch actions here, like lazy-loading the item details
    }
  }, [entry?.isIntersecting, item.id])

  return (
    <div
      className={` relative h-full   flex flex-col items-center justify-center  transition-all duration-1000  ${entry?.isIntersecting ? 'bg-green-200' : 'bg-pink-900'}`}
    >
      {/* This div serves as a workaround to prematurely trigger the 'inView' class in a horizontally scrollable div. Normally, setting ref on a container with overflow would apply 'inView' to all child elements on mobile. This happens because the container's height on mobile wraps all content, making all children effectively 'in view'. This hack specifically targets only the necessary elements without affecting others by using negative inset values and a low z-index. It is preventing unwanted rendering of video tags for all elements. */}

      <div
        ref={ref}
        className="absolute inset-y-0 -inset-x-[100px] z-[-1000]"
      ></div>
      {/* <VideoTest /> */}
      <div className="absolute z-[0] top-0 left-0 w-full h-full ">
        <img
          src="https://image.mux.com/WAJskpJEdrvho71n7CZkRjno0200Ewry2jGRhSf654IzY/thumbnail.png?width=5&time=0"
          className="absolute w-full h-full "
        />
      </div>

      <Link className="z-[10] " href={`article/${item.id}`}>
        {entry?.isIntersecting && <VideoTest />}
      </Link>
    </div>
  )
}
