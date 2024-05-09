import { PostPayload } from '@/utils/types/sanity'
import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React from 'react'

export interface PostPageProps {
  data: PostBySlugQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}
export function PostPage({ data, encodeDataAttribute }: PostPageProps) {
  const { title, publishedAt, artists } = data ?? {}

  // Convert it to a Date object
  const dateObj = publishedAt ? new Date(publishedAt) : ''

  // Use Intl.DateTimeFormat to format the date in the desired style
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  // @ts-ignore
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
    //@ts-ignore
    dateObj
  )

  return (
    <div className="max-w-screen-lg mx-auto mt-36 ">
      <div className="flex flex-col gap-16 items-center w-full px-16">
        <p className="text-sm tracking-tight">{formattedDate}</p>
        <div className="w-full space-y-4">
          <h1 className="text-3xl tracking-tight text-pretty font-semibold uppercase">
            {title}
          </h1>

          {artists && artists.length > 0 && (
            <p className="w-fit mx-auto italic ">
              with
              {artists.map((artist) => (
                <React.Fragment key={artist._key}>
                  {' '}
                  <span className="">{artist.name}</span>
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
