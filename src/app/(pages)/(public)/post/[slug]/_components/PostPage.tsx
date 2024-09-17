import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React from 'react'
import FiltersPreview from '../../../browse/_components/post-preview/FilterPreview'

import ContentHeadlines from './ContentHeadlines'
import { CustomPortableText } from '@/components/shared/CustomPortableText'
import ResourcesDownload from './ResourcesDownload'
import Image from 'next/image'
import { EpisodePDF } from './EpisodePDF'

export interface PostPageProps {
  data: PostBySlugQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export function PostPage({ data, encodeDataAttribute }: PostPageProps) {
  const {
    _id,
    title,
    coverImage,
    publishedAt,
    artistList,
    filters,
    subtitle,
    pageContent,
    downloadFiles,
    episodePDF
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
        <div className=" mx-auto my-24 px-4  space-y-20  ">
          {coverImage?.asset?.url && coverImage?.asset?.lqip && (
            <div className="w-full sm:w-96 aspect-square mx-auto">
              <Image
                src={coverImage.asset.url}
                alt={`cover image for a post ${title}`}
                width={600}
                height={600}
                className="w-full h-full object-contain"
                placeholder="blur"
                blurDataURL={coverImage.asset.lqip}
              />
            </div>
          )}
          <section className=" space-y-4 items-center w-full  ">
            {publishedAt && (
              <p className="text-sm tracking-tight text-center">
                {publishedAt}
              </p>
            )}
            <ContentHeadlines
              title={title}
              subtitle={subtitle}
              artistList={artistList}
            />
          </section>
          <section className="gap-8 text-center  space-y-4">
            <FiltersPreview
              filters={filters}
              variantClass={'text-xs '}
              variantWrapperClass={'justify-center'}
            />

            {introTextBlocks && introTextBlocks.length > 0 && (
              <div className="intro-text-container font-neue text-lg md:text-xl text-left">
                <CustomPortableText value={introTextBlocks} />
              </div>
            )}
            <ResourcesDownload downloadFiles={downloadFiles} />
          </section>
          {episodePDF?.embedOnPage && episodePDF?.file && (
            <EpisodePDF file={episodePDF.file} />
          )}

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
