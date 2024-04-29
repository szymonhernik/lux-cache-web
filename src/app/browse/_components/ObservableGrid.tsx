'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

// https://react-intersection-observer.vercel.app/?path=/docs/intro--docs
import { useInfiniteQuery } from '@tanstack/react-query'
import { pages } from 'next/dist/build/templates/app-page'
import Link from 'next/link'
import { useDebouncedCallback, useIntersection } from '@mantine/hooks'
import VideoTest from './VideoTest'
import { AspectRatio } from '@/components/shadcn/ui/aspect-ratio'
// const posts = [
//   { id: 1, title: 'Post 1' },
//   { id: 2, title: 'Post 2' },
//   { id: 3, title: 'Post 3' },
//   { id: 4, title: 'Post 4' },
//   { id: 5, title: 'Post 5' },
//   { id: 6, title: 'Post 6' }
// ]
// Generate an array of 100 items
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
  // v4 tanstack/react-query
  // const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
  //   ['query'],
  //   async ({ pageParam = 1 }) => {
  //     const response = await fetchPostMock(pageParam)
  //     return response
  //   },
  //   {
  //     getNextPageParam: (_, pages) => {
  //       return pages.length + 1
  //     },
  //     initialData: {
  //       pages: [generatedItems.slice(0, numberOfItemsPerPage)],
  //       pageParams: [1]
  //     }
  //   }
  // )

  const lastPostRef = useRef<HTMLElement>(null)
  const containerRef = useRef<any>(null)

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  })

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry])
  const _posts = data?.pages.flatMap((page) => page)

  return (
    <div className="lg:flex">
      {data?.pages.map((page, i) => (
        <div
          key={i}
          // className="grid md:grid-cols-2 lg:grid-rows-custom lg:grid-flow-col-dense lg:h-full  gap-0  bg-pink-50"
          className="grid grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0 bg-pink-50"
          // className="flex flex-col flex-wrap lg:h-full "
        >
          {page.map(
            (post, index) =>
              index === page.length - 1 ? (
                <div
                  className={`w-full lg:w-[calc((80vh-4rem)/2)] aspect-square `}
                  ref={ref}
                >
                  <ListItem key={post.id} item={post} />
                </div>
              ) : (
                <div
                  className={`w-full lg:w-[calc((80vh-4rem)/2)] aspect-square `}
                  ref={ref}
                >
                  <ListItem key={post.id} item={post} />
                </div>
              ) // Other items do not get a ref
            // (
            //     <div
            //       key={post.id}
            //       className=" bg-blue-200 w-full lg:w-[calc((80vh-4rem)/2)] aspect-square "
            //     >
            //       {post.content}
            //       {/* <AspectRatio ratio={16 / 9} className=" bg-lime-100 h-full">
            //         {post.content}
            //       </AspectRatio> */}
            //     </div>
            //     //  <div
            //     //     key={post.id}
            //     //     className={`aspect-square bg-blue-200 w-[40vh]  `}
            //     //   >
            //     //     {post.content}
            //     //   </div>
            //   )
            // index === page.length - 1 ? (
            //   <div className={`h-48 aspect-square `} ref={ref}>
            //     <ListItem key={post.id} item={post} />
            //   </div>
            // ) : (
            //   <div className={`h-48 aspect-square `} ref={ref}>
            //     <ListItem key={post.id} item={post} />
            //   </div>
            // ) // Other items do not get a ref
          )}
        </div>
      ))}
      <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage
          ? 'Loading more...'
          : (data?.pages.length ?? 0) < posts.length / numberOfItemsPerPage
            ? 'Load more'
            : 'Nothing more to load'}
      </button>
    </div>
  )
}

function ListItem({ item }: { item: { id: number; content: string } }) {
  const { ref, inView, entry } = useInView({
    threshold: 0, // Customize the threshold as needed
    rootMargin: '100px 0%'
  })
  // const { ref, entry } = useIntersection({
  //   threshold: 0.0, // Customize the threshold as needed
  //   rootMargin: '100px 100px 100px 100px'
  // })

  useEffect(() => {
    if (inView) {
      console.log(`Item ${item.id} is in view.`)
      // You could dispatch actions here, like lazy-loading the item details
    }
  }, [inView, item.id])

  return (
    <div
      className={` relative h-full   flex flex-col items-center justify-center border border-white transition-all duration-1000  ${inView ? 'bg-green-200' : 'bg-pink-900'}`}
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

      <Link className="z-[10]" href={`article/${item.id}`}>
        {inView && <VideoTest />}
      </Link>
    </div>
  )
}
