'use client'
import { Button, buttonVariants } from '@/components/shadcn/ui/button'
import { SinglePostType } from '@/utils/types/sanity'
import Link from 'next/link'
import CloseButton from './CloseButton'
import { Suspense, useCallback } from 'react'
import CloseIcon from '@/components/icons/CloseIcon'
import LockIcon from '@/components/icons/LockIcon'
import { LockClosedIcon } from '@radix-ui/react-icons'

type Props = {
  data: SinglePostType
  canAccess?: boolean | 'loading'
  onModalDisplayChange?: (value: boolean) => void
}
export default function EpisodePreview(props: Props) {
  const { data, canAccess, onModalDisplayChange } = props
  const { title, publishedAt, filters, ogDescription, slug, subtitle } = data

  const handleModalDisplayChange = () => {
    // console.log('Handle close modal')

    if (onModalDisplayChange) {
      console.log('Handle close modal')
      onModalDisplayChange(false)
    } else {
      return null
    }
  }

  // console.log('filters', filters)
  const copyToClipboard = useCallback(() => {
    const postUrl = `${window.location.origin}/browse/${slug}`
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        console.log('Link copied to clipboard: ', postUrl)
      })
      .catch((error) => {
        console.error('Error copying link to clipboard: ', error)
      })
  }, [slug])

  return (
    <div className="bg-white w-[90vw] h-[80dvh]  lg:w-[80vw] lg:h-[80dvh] overflow-y-auto  overscroll-contain relative flex flex-col md:flex-row  md:items-start md:justify-center lg:max-w-screen-xl">
      {/* Image */}
      <div className="bg-yellow-200 md:grow md:w-1/2 min-h-[30dvh]  h-[30dvh] md:h-[80dvh] flex items-center justify-center sticky  top-0 left-0 z-[0]">
        <div className="rounded-md bg-black  w-4/5 md:h-[70%] text-white py-8 px-6 font-semibold text-sm space-y-4">
          <p>
            This content is for Supporters, Subscribers and Premium Subscribers
            only.
          </p>
          <button className="underline">Subscribe</button>
        </div>
      </div>
      {/* Textual */}
      <div className="p-4 md:p-8 flex flex-col z-10 bg-white pb-16 mb-16 md:grow md:w-1/2">
        <div className="w-full text-right md:sticky md:top-8 md:right-0">
          {onModalDisplayChange ? (
            <button
              onClick={() => {
                handleModalDisplayChange()
              }}
              className="close-button self-end"
            >
              <CloseIcon />
            </button>
          ) : (
            <Suspense>
              <CloseButton />
            </Suspense>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-8 max-w-lg w-full self-center mx-auto">
          <div>
            <p className="">{publishedAt}</p>
            <h1 className="text-2xl font-semibold">{title}</h1>
            {subtitle && <h3 className="font-neue italic">{subtitle}</h3>}

            {filters && filters.length > 0 && (
              <div className="mt-2 flex gap-2">
                {filters?.map((filter) => (
                  <p
                    className="border-[1px]  px-2 py-1 w-fit border-black rounded-full "
                    key={filter.slug}
                  >
                    {filter.slug}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-neue">{ogDescription}</p>
          </div>
          <Button disabled size={'lgIcon'} className="self-center">
            <LockClosedIcon className="w-5 h-5" /> <span>Read</span>
          </Button>
          <Button
            variant={'ghost'}
            onClick={copyToClipboard}
            className="text-sm font-normal"
          >
            Share Preview Link
          </Button>
        </div>
      </div>
      {/* <div className="flex justify-end p-4">
        {onModalDisplayChange ? (
          <button
            onClick={() => {
              handleModalDisplayChange()
            }}
            className="close-button"
          >
            {' '}
            close{' '}
          </button>
        ) : (
          <Suspense>
            <CloseButton />
          </Suspense>
        )}
      </div>
      <div className="p-4">
        <h1 className="text-xl">{title}</h1>
        <p className="">{publishedAt}</p>
        <p>
          In this Lux Cache track breakdown series, we invite artists,
          producers, engineers and songwriters to uncover the creative process
          of their work in their own words. In this chapter, we are joined by
          IDM visionary and Planet Mu founder u-Ziq (aka Mike Paradinas) to
          discuss his 30+ year legacy career in electronic music, discussing
          working alongside peers such as Aphex Twin and Squarepusher and
          breaking down the production of his recent single ‘Goodbye’, giving us
          a behind-the-scenes look at his offkilter breakbeat sound.
        </p>
        {canAccess === 'loading' ? (
          <p>Loading...</p>
        ) : canAccess ? (
          <p>Access allowed</p>
        ) : (
          <p>Access denied</p>
        )}

        <Link
          href={`/post/${slug}`}
          className={buttonVariants({ variant: 'default' })}
        >
          Read
        </Link>
      </div> */}
    </div>
  )
}
