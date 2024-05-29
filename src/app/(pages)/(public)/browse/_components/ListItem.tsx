// @ts-nocheck
'use client'
import { useIntersection } from '@mantine/hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import VideoTest from './VideoTest'
import { testVidAsset } from '@/app/common/testasset'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import {
  InitialPostsQueryResult,
  MorePostsQueryResult,
  Post,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'

import { usePathname, useSearchParams } from 'next/navigation'
import { SinglePostType } from '@/utils/types/sanity'

export default function ListItem({
  item,
  encodeDataAttribute
}: {
  item:
    | InitialPostsQueryResult['posts'][number]
    | PostsQueryResult['posts'][number]
  encodeDataAttribute?: EncodeDataAttributeCallback
}) {
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const { ref, entry } = useIntersection({
    threshold: 0.0, // Customize the threshold as needed
    rootMargin: '100px 0%'
  })
  const pathName = usePathname()
  //  Simple check to detect if JS is enabled
  const [js, setJs] = useState(false)
  useEffect(() => {
    setJs(true)
  }, [])

  // useEffect(() => {
  //   if (entry?.isIntersecting) {
  //     // console.log(`Item ${item._id} is in view.`)
  //     // You could dispatch actions here, like lazy-loading the item details
  //   }
  // }, [entry?.isIntersecting, item._id])

  return (
    <div
      className={` relative h-full   flex flex-col items-center justify-center  transition-all duration-200 hover:bg-opacity-50 ${entry?.isIntersecting ? 'bg-green-300' : 'bg-green-100'} `}
    >
      {/* This div serves as a workaround to prematurely trigger the 'inView' class in a horizontally scrollable div. Normally, setting ref on a container with overflow would apply 'inView' to all child elements on mobile. This happens because the container's height on mobile wraps all content, making all children effectively 'in view'. This hack specifically targets only the necessary elements without affecting others by using negative inset values and a low z-index. It is preventing unwanted rendering of video tags for all elements. */}

      <div
        ref={ref}
        className="absolute inset-y-0 -inset-x-[100px] z-[-1000]"
      ></div>
      {/* <VideoTest /> */}
      <Link
        className="z-[10]"
        href={
          js
            ? `${pathName}/${item.slug}${filters ? `?filter=${filters}` : ''}`
            : `/post/${item.slug}`
        } // make sure users with js disabled can go to posts directly
      >
        <div className="absolute z-[0] top-0 left-0 w-full h-full ">
          {/* <img
          src={`https://image.mux.com/${testVidAsset.playbackId}/thumbnail.png?width=5&time=0`}
          className="absolute w-full h-full "
        /> */}

          <p>{item.title}</p>
          <div className="mt-2 flex items-center gap-2">
            {item.filters?.map((filter) => (
              <p
                className="border-2 p-1 w-fit border-black  font-semibold"
                key={filter.slug}
              >
                {filter.slug}
              </p>
            ))}
          </div>
          {/* <p>{item.filters}</p> */}
        </div>

        {/* {entry?.isIntersecting && <VideoTest />} */}
      </Link>
    </div>
  )
}
