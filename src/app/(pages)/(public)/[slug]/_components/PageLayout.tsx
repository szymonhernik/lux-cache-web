import { CustomPortableTextPages } from '@/components/shared/CustomPortableTextPages'

import { PageBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React from 'react'

export interface PageProps {
  data: PageBySlugQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}
export function PageLayout({ data, encodeDataAttribute }: PageProps) {
  const { title, slug, pageContent } = data ?? {}
  console.log('pageContent', pageContent)

  return (
    <>
      <h1 className="text-shadow text-sm font-semibold lg:sticky lg:top-0 p-4 lg:p-6 uppercase ">
        {title}
      </h1>
      <article className="max-w-4xl mx-auto">
        <div className="mx-auto my-36 px-4  space-y-24">
          {pageContent && (
            <CustomPortableTextPages paragraphClasses="" value={pageContent} />
          )}
        </div>
      </article>
    </>
  )
}
