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
  // if (item.coverVideoMux) {
  //   console.log(item.coverVideoMux)
  // }

  return (
    <>
      <div
        onClick={() => {
          setModalOpen(true)
        }}
        className={clsx(
          `hover:cursor-pointer lg:opacity-80 hover:opacity-100 relative h-full   flex flex-col   transition-all duration-200 hover:bg-opacity-50`,
          !view && entry?.isIntersecting && 'bg-green-300',
          view === 'list' && ' pt-8 pl-10 pr-4 ',
          !view && 'items-center justify-center'
        )}
      >
        {/* This div serves as a workaround to prematurely trigger the 'inView' class in a horizontally scrollable div. Normally, setting ref on a container with overflow would apply 'inView' to all child elements on mobile. This happens because the container's height on mobile wraps all content, making all children effectively 'in view'. This hack specifically targets only the necessary elements without affecting others by using negative inset values and a low z-index. It is preventing unwanted rendering of video tags for all elements. */}

        <div
          ref={ref}
          className={clsx('absolute inset-y-0  z-[-1000]', {
            'lg:-inset-x-[800px]': !view,
            'inset-x-0': view === 'list'
          })}
        ></div>
        {/* <VideoTest video={item.coverVideoMux} /> */}
        {/* <button
          onClick={() => {
            setModalOpen(true)
          }}
        > */}
        <div className="absolute z-[0] top-0 left-0 w-full h-full *:text-left ">
          {!view && item?.coverVideoMux?.videoFile?.asset && (
            <img
              // @ts-ignore
              src={`https://image.mux.com/${item.coverVideoMux.videoFile.asset?.playbackId}/thumbnail.png?width=5&time=0`}
              className="absolute w-full h-full "
            />
          )}
        </div>
        {view && <h1 className="uppercase font-semibold ">{item.title}</h1>}

        {!view && entry?.isIntersecting && item.coverVideoMux?.videoFile && (
          <VideoTest video={item.coverVideoMux.videoFile} />
        )}
        {/* </Link> */}
        {/* </button> */}
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
      )}
    </>
  )
}
