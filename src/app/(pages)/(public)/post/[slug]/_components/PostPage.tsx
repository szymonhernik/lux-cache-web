import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React, { Suspense } from 'react'
import FiltersPreview from '../../../browse/_components/post-preview/FilterPreview'
import PostNavbar from './PostNavbar'
import ContentHeadlines from './ContentHeadlines'
import { CustomPortableText } from '@/components/shared/CustomPortableText'
import ResourcesDownload from './ResourcesDownload'
import { PortableTextBlock } from 'next-sanity'
import { UpdatedPostBySlugQueryResult } from '@/utils/types/sanity'

export interface PostPageProps {
  data: PostBySlugQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export function PostPage({ data, encodeDataAttribute }: PostPageProps) {
  const {
    _id,
    title,
    publishedAt,
    artistList,
    filters,
    subtitle,
    pageContent,
    downloadFiles
  } = data ?? {}

  const introTextBlocks = pageContent?.filter(
    (block) => block._type === 'introText'
  )
  const remainingContent = pageContent?.filter(
    (block) => block._type !== 'introText'
  )

  return (
    <>
      <article className="max-w-4xl mx-auto">
        {/* Post content */}
        <div className=" mx-auto my-36 px-4  space-y-24  ">
          <section className="gap-8 text-center  space-y-4">
            {/* <ContentOverview publishedAt={publishedAt} filters={filters} /> */}
            <p className="text-sm tracking-tight">May 21, 2024</p>
            <FiltersPreview filters={filters} variantClass={'text-xs '} />

            {introTextBlocks && introTextBlocks.length > 0 && (
              <div className="intro-text-container font-neue text-lg md:text-xl text-left">
                <CustomPortableText value={introTextBlocks} />
              </div>
            )}
            <ResourcesDownload downloadFiles={downloadFiles} />
          </section>
          <section className=" gap-16 items-center w-full  ">
            <ContentHeadlines
              title={title}
              subtitle={subtitle}
              artistList={artistList}
            />
          </section>
          {remainingContent && remainingContent.length > 0 && (
            <div className="remaining-content-container  max-w-3xl mx-auto">
              <CustomPortableText
                paragraphClasses=""
                value={remainingContent}
              />
            </div>
          )}
        </div>
      </article>
    </>
  )
}
