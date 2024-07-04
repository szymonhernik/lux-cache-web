'use client'

import { useHover, useIntersection } from '@mantine/hooks'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { testVidAsset } from '@/app/common/testasset'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/shadcn/ui/dialog'
import { Button } from '@/components/shadcn/ui/button'
import VideoTest from './VideoTest'
import clsx from 'clsx'
import { canAccessPost } from '@/utils/helpers/subscriptionUtils'
import { Modal } from '../../preview/@modal/[slug]/modal'
import EpisodePreview from '../post-preview/EpisodePreview'

export default function ListItem({
  item,
  encodeDataAttribute,
  userTier,
  isLoading
}: {
  item:
    | InitialPostsQueryResult['posts'][number]
    | PostsQueryResult['posts'][number] // this is used in draft mode
  encodeDataAttribute?: EncodeDataAttributeCallback
  userTier?: number
  isLoading?: boolean
}) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const view = searchParams.get('view')
  const { ref, entry } = useIntersection({
    threshold: 0.0, // Customize the threshold as needed
    rootMargin: '100px 0%'
  })

  const canAccess = canAccessPost(userTier, item.minimumTier)

  // const pathName = usePathname()
  //  Simple check to detect if JS is enabled
  const [js, setJs] = useState(false)
  useEffect(() => {
    setJs(true)
    setModalOpen(false)
  }, [])

  const handleModalClose = () => {
    setModalOpen(false)
  }

  //on esc key press setModalOpen to false
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])
  return (
    <>
      <div
        className={` relative h-full   flex flex-col items-center justify-center  transition-all duration-200 hover:bg-opacity-50 ${entry?.isIntersecting ? 'bg-green-300' : 'bg-green-100'} `}
      >
        {/* This div serves as a workaround to prematurely trigger the 'inView' class in a horizontally scrollable div. Normally, setting ref on a container with overflow would apply 'inView' to all child elements on mobile. This happens because the container's height on mobile wraps all content, making all children effectively 'in view'. This hack specifically targets only the necessary elements without affecting others by using negative inset values and a low z-index. It is preventing unwanted rendering of video tags for all elements. */}

        <div
          ref={ref}
          className={clsx('absolute inset-y-0  z-[-1000]', {
            'lg:-inset-x-[100px]': !view,
            'inset-x-0': view === 'list'
          })}
        ></div>
        {/* <VideoTest /> */}
        <button
          onClick={() => {
            setModalOpen(true)
          }}
        >
          <div className="absolute z-[0] top-0 left-0 w-full h-full *:text-left ">
            {/* <img
          src={`https://image.mux.com/${testVidAsset.playbackId}/thumbnail.png?width=5&time=0`}
          className="absolute w-full h-full "
        /> */}

            <p>{item.title}</p>
            <p>{item.minimumTier}</p>
            {canAccess ? <p>Can access</p> : <p>Cannot access</p>}
            {/* {isLoading ? (
              <p>loading...</p>
            ) : (
              <p>can access: {canAccess ? 'Yes' : 'No'}</p>
            )} */}

            {/* <Link
            className="z-[10]"
            href={
              js
                ? `/post/${item.slug}${filters ? `?filter=${filters}` : ''}`
                : `/post/${item.slug}`
            } // make sure users with js disabled can go to posts directly
          >
            {canAccess ? <p>Go to post</p> : <p>Blocked</p>}
          </Link> */}
            <div className="mt-2 flex gap-2">
              {item.filters?.map((filter) => (
                <p
                  className="border-2 p-1 w-fit border-black  font-semibold"
                  key={filter.slug}
                >
                  {filter.slug}
                </p>
              ))}
            </div>
          </div>
        </button>

        {/* {entry?.isIntersecting && <VideoTest />} */}
        {/* </Link> */}
      </div>
      {modalOpen && (
        <Modal onModalDisplayChange={handleModalClose}>
          {item && (
            <EpisodePreview
              data={item}
              onModalDisplayChange={handleModalClose}
              canAccess={canAccess}
            />
          )}
        </Modal>
        // <Dialog open={modalOpen}>
        //   <DialogContent>
        //     <DialogHeader>
        //       <DialogTitle>Are you absolutely sure?</DialogTitle>
        //       <DialogDescription>
        //         This action cannot be undone. This will permanently delete your
        //         account and remove your data from our servers.
        //       </DialogDescription>
        //       <a
        //         target="_blank"
        //         className={clsx(`z-[10] bg-violet-400 rounded-sm p-2 w-fit`, {
        //           'cursor-pointer': canAccess,
        //           'cursor-not-allowed': !canAccess
        //         })}
        //         onClick={() => {
        //           // setModalOpen(false)
        //           canAccess ? router.push(`/post/${item.slug}`) : null
        //         }}
        //         // href={canAccess ? `/post/${item.slug}` '#'
        //       >
        //         {canAccess ? <p>Go to post</p> : <p>Blocked</p>}
        //       </a>
        //     </DialogHeader>
        //     {/* <DialogClose asChild> */}

        //     <Button
        //       type="button"
        //       variant="secondary"
        //       onClick={() => {
        //         setModalOpen(false)
        //       }}
        //     >
        //       Close
        //     </Button>
        //     {/* </DialogClose> */}
        //   </DialogContent>
        // </Dialog>
      )}
    </>
  )
}
