'use client'

import { useIntersection } from '@mantine/hooks'

import { useEffect, useState } from 'react'

import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'

import { useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { canAccessPost } from '@/utils/helpers/subscriptionUtils'
import { Modal } from '../../preview/@modal/[slug]/modal'
import EpisodePreview from '../post-preview/EpisodePreview'
import PreviewVideo from '../../../post/[slug]/_components/PreviewVideo'
import Image from 'next/image'
import { FaceIcon, LockClosedIcon } from '@radix-ui/react-icons'

export default function ListItem({
  item,
  isTouchDevice,
  encodeDataAttribute,
  userTier,
  userRole,
  isLoading,
  isDesktop
}: {
  item:
    | InitialPostsQueryResult['posts'][number]
    | PostsQueryResult['posts'][number] // this is used in draft mode
  encodeDataAttribute?: EncodeDataAttributeCallback
  userTier?: number
  userRole?: string
  isLoading?: boolean
  isDesktop: boolean
  isTouchDevice: boolean
}) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const view = searchParams.get('view')

  // intersection observer used to detect if the item is even partly in the viewport
  const { ref, entry } = useIntersection({
    threshold: 0.0,
    rootMargin: '100px 0%'
  })

  // intersection observer used to detect if the item is fully (=100%) in the viewport to trigger the video
  const { ref: fullViewRef, entry: entryFull } = useIntersection({
    rootMargin: '0% 0%',
    threshold: 0.8
  })

  const canAccess =
    userRole === 'admin' ? true : canAccessPost(userTier, item.minimumTier)

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

  const [shouldRenderVideo, setShouldRenderVideo] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined
    if (entryFull?.isIntersecting) {
      timeoutId = setTimeout(() => {
        setShouldRenderVideo(true)
      }, 1000)
    } else {
      clearTimeout(timeoutId)
      setShouldRenderVideo(false)
    }
    return () => clearTimeout(timeoutId)
  }, [entryFull?.isIntersecting])

  return (
    <>
      <div
        onClick={() => {
          setModalOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setModalOpen(true)
          }
        }}
        tabIndex={0}
        className={clsx(
          `hover:cursor-pointer group opacity-90 hover:opacity-70 relative h-full focus:opacity-70 focus:-outline-offset-2 focus:outline-lime-500 focus:outline  flex items-start justify-between  transition-all duration-200 hover:bg-opacity-50 overflow-hidden`,
          !view && entry?.isIntersecting && '',
          view === 'list' && ' py-8 px-8  ',
          !view && 'items-center justify-center'
        )}
        ref={fullViewRef}
      >
        {/* This div serves as a workaround to prematurely trigger the 'inView' class in a horizontally scrollable div. Normally, setting ref on a container with overflow would apply 'inView' to all child elements on mobile. This happens because the container's height on mobile wraps all content, making all children effectively 'in view'. This hack specifically targets only the necessary elements without affecting others by using negative inset values and a low z-index. It is preventing unwanted rendering of video tags for all elements. */}
        <div
          ref={ref}
          className={clsx('absolute inset-y-0  z-[-1000]', {
            'lg:-inset-x-[120px]': !view,
            'inset-x-0 ': view === 'list'
          })}
        ></div>
        {!view && !canAccess && (
          <div className="absolute top-3 right-3 p-2 shadow  bg-opacity-50 backdrop-blur group-hover:bg-neutral-200 transition-colors  ">
            {' '}
            <LockClosedIcon className="min-w-4 min-h-4" />
          </div>
        )}
        {userRole === 'admin' && (
          <div className="absolute top-3 right-3 p-2 shadow  bg-opacity-50 backdrop-blur group-hover:bg-neutral-200 transition-colors rounded-full ">
            <FaceIcon className="min-w-4 min-h-4" />
          </div>
        )}
        {!view && item?.coverImage?.asset?.lqip && (
          <img
            src={item.coverImage?.asset.lqip}
            className="h-full w-full blur-[32px] scale-150  z-[-1] object-cover absolute top-0 right-0 bottom-0 left-0"
          />
        )}

        {/* On mobile and tablet breakpoints render image in the background*/}
        {!view && isTouchDevice && item?.coverImage?.asset?.url && (
          // TODO: consider not using next image here, use simple img tag
          // <img
          //   className="h-[full] w-full aspect-square object-cover  z-[-1] absolute top-0 right-0 bottom-0 left-0"
          //   src={`${item.coverImage?.asset.url}?w=600&fm=webp`}
          //   alt={''}
          // />
          <Image
            className="h-[full] w-full aspect-square object-cover  z-[-1] absolute top-0 right-0 bottom-0 left-0 "
            src={item.coverImage?.asset.url}
            alt={''}
            width={400}
            height={400}
          />
        )}
        {!view &&
          !isTouchDevice &&
          entry?.isIntersecting &&
          item?.previewVideo && (
            <PreviewVideo
              isTouchDevice={isTouchDevice}
              previewVideo={item.previewVideo}
              isDesktop={isDesktop}
            />
          )}
        {/* when on touch devices render preview video only if the element has been touched */}
        {/* this prevents the video from being added when the user quickly scrolls through the page */}
        {!view && isTouchDevice && shouldRenderVideo && item?.previewVideo && (
          <PreviewVideo
            isTouchDevice={isTouchDevice}
            previewVideo={item.previewVideo}
            isDesktop={isDesktop}
          />
        )}
        {view && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between ">
              <div className="flex-1 pr-4 flex items-start gap-2 ">
                <h1 className="uppercase font-semibold ">{item.title}</h1>
                {!canAccess && (
                  <LockClosedIcon className="mt-[2px] min-w-[18px] min-h-[18px] " />
                )}
              </div>
              {item?.coverImage?.asset?.url && (
                // TODO: consider not using next image here, use simple img tag
                <Image
                  className="aspect-square  object-cover w-24 h-24 sm:w-36 sm:h-36 lg:hidden"
                  src={`${item.coverImage?.asset.url}?w=400&h=400&fm=webp`}
                  alt={''}
                  width={160}
                  height={160}
                />
              )}
            </div>
            <div>
              <h3 className="uppercase text-secondary-foreground font-semibold text-xs mb-1">
                Description
              </h3>
              <p className="font-serif italic text-sm max-w-4xl">
                {item.ogDescription}
              </p>
            </div>
          </div>
        )}
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
