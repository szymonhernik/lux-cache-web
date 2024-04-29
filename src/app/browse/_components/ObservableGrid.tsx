'use client'

import { Fragment, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

// https://react-intersection-observer.vercel.app/?path=/docs/intro--docs
import { useInfiniteQuery } from '@tanstack/react-query'
import { pages } from 'next/dist/build/templates/app-page'
import Link from 'next/link'
import { useIntersection } from '@mantine/hooks'
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
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  })

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry])
  // const _posts = data?.pages.flatMap((page) => page)

  return (
    <div className="lg:w-max lg:h-full lg:flex">
      {/* {_posts?.map((post, i) => {
        if (i === _posts.length - 1)
          return (
            <div key={post.id} ref={ref}>
              {post.content}
            </div>
          )
        return <div key={post.id}>{post.content}</div>
      })} */}
      {data?.pages.map((page, i) => (
        <div
          key={i}
          className="grid md:grid-cols-2 lg:grid-rows-custom lg:grid-flow-col-dense lg:h-full  gap-0  bg-pink-50"
        >
          {page.map(
            (post, index) =>
              index === page.length - 1 ? (
                <div className={`w-full aspect-square `} ref={ref}>
                  <ListItem key={post.id} item={post} />
                </div>
              ) : (
                <div className={`w-full aspect-square `} ref={ref}>
                  <ListItem key={post.id} item={post} />
                </div>
              ) // Other items do not get a ref
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
    rootMargin: '0px 0px'
  })

  // You can also use `inView` to perform actions when the item is visible
  useEffect(() => {
    if (inView) {
      console.log(`Item ${item.id} is in view.`)
      // You could dispatch actions here, like lazy-loading the item details
    }
  }, [inView, item.id])

  return (
    <div
      ref={ref}
      className={`w-full  aspect-square flex flex-col items-center justify-center border border-white transition-all duration-1000 ${inView ? 'bg-green-200' : 'bg-pink-900'}`}
    >
      <Link href={`article/${item.id}`}>{item.content}</Link>
      {inView && <video className="border-white border w-16">video</video>}
    </div>
  )
}
