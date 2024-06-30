import { PostPayload } from '@/utils/types/sanity'
import { PageBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React from 'react'

export interface PageProps {
  data: PageBySlugQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}
export function PageLayout({ data, encodeDataAttribute }: PageProps) {
  const { title, slug } = data ?? {}

  return (
    <div className="max-w-screen-lg mx-auto mt-36 ">
      <div className="flex flex-col gap-16 items-center w-full px-16">
        <h1>{title}</h1>
      </div>
    </div>
  )
}
