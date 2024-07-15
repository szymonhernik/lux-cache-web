'use client'

import { useHover, useIntersection } from '@mantine/hooks'

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
import { LockClosedIcon } from '@radix-ui/react-icons'

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
          `hover:cursor-pointer group opacity-90 hover:opacity-70 relative h-full   flex items-start justify-between  transition-all duration-200 hover:bg-opacity-50 overflow-hidden`,
          !view && entry?.isIntersecting && '',
          view === 'list' && ' py-8 px-8  ',
          !view && 'items-center justify-center'
        )}
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

        {!view && item?.coverImage?.asset?.lqip && (
          <img
            src={item.coverImage?.asset.lqip}
            className="h-full w-full blur-[32px] scale-150  z-[-1] object-cover absolute top-0 right-0 bottom-0 left-0"
          />
        )}

        {!view && entry?.isIntersecting && item?.previewVideo && (
          <PreviewVideo previewVideo={item.previewVideo} />
        )}
        {view && (
          <>
            <div className="flex-1 pr-4 flex items-start gap-2">
              <h1 className="uppercase font-semibold ">{item.title}</h1>
              {!canAccess && (
                <LockClosedIcon className="mt-[2px] min-w-[18px] min-h-[18px] " />
              )}
            </div>
            {item?.coverImage?.asset?.url && (
              <Image
                className="aspect-square  object-cover w-24 h-24 sm:w-36 sm:h-36 lg:hidden"
                src={item.coverImage?.asset.url}
                alt={''}
                width={160}
                height={160}
              />
            )}
          </>
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
