// @ts-nocheck
import { Button } from '@/components/shadcn/ui/button'
import { PostPayload } from '@/utils/types/sanity'
import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { BookmarkIcon } from '@radix-ui/react-icons'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React, { Suspense } from 'react'
import FiltersPreview from '../../../browse/_components/post-preview/FilterPreview'
import ContentOverview from './ContentOverview'
import PostNavbar from './PostNavbar'
import Link from 'next/link'
import ContentHeadlines from './ContentHeadlines'
import VideoThroughCDNTest from './VideoThroughCDNTest'
import { CustomPortableText } from '@/components/shared/CustomPortableText'

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
    pageContent
  } = data ?? {}

  const introTextBlocks = pageContent?.filter(
    (block) => block._type === 'introText'
  )
  const remainingContent = pageContent?.filter(
    (block) => block._type !== 'introText'
  )

  return (
    <>
      <div className="flex items-center gap-4 p-4 sticky top-0 left-0 flex-row-reverse md:flex-row justify-between md:justify-start">
        <Suspense fallback={<h1>Loading navbar</h1>}>
          {_id && <PostNavbar title={title} post_id={_id} />}
        </Suspense>
      </div>
      <article className="max-w-4xl mx-auto">
        {/* Post content */}
        <div className=" mx-auto my-36 px-4  space-y-24  ">
          <section className="gap-8 text-center  space-y-4">
            {/* <ContentOverview publishedAt={publishedAt} filters={filters} /> */}
            <p className="text-sm tracking-tight">May 21, 2024</p>
            <FiltersPreview filters={filters} variantClass={'text-xs '} />

            {introTextBlocks && introTextBlocks.length > 0 && (
              <div className="intro-text-container">
                <CustomPortableText
                  paragraphClasses="font-neue text-lg md:text-xl text-left"
                  value={introTextBlocks}
                />
              </div>
            )}
            <Button className="w-fit">Downloads</Button>
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
          {/* <section className="">
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32. Contrary to popular
            belief, Lorem Ipsum is not simply random text. It has roots in a
            piece of classical Latin literature from 45 BC, making it over 2000
            years old. Richard McClintock, a Latin professor at Hampden-Sydney
            College in Virginia, looked up one of the more obscure Latin words,
            consectetur, from a Lorem Ipsum passage, and going through the cites
            of the word in classical literature, discovered the undoubtable
            source.
            <br />
            <br />
            Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
            Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
            written in 45 BC. This book is a treatise on the theory of ethics,
            very popular during the Renaissance. The first line of Lorem Ipsum,
            "Lorem ipsum dolor sit amet..", comes from a line in section
            1.10.32. Contrary to popular belief, Lorem Ipsum is not simply
            random text. It has roots in a piece of classical Latin literature
            from 45 BC, making it over 2000 years old. Richard McClintock, a
            Latin professor at Hampden-Sydney College in Virginia, looked up one
            of the more obscure Latin words, consectetur, from a Lorem Ipsum
            passage, and going through the cites of the word in classical
            literature, discovered the undoubtable source. Lorem Ipsum comes
            from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
            (The Extremes of Good and Evil) by Cicero, written in 45 BC. This
            book is a treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32. Contrary to popular
            belief, Lorem Ipsum is not simply random text. It has roots in a
            piece of classical Latin literature from 45 BC, making it over 2000
            years old. Richard McClintock, a Latin professor at Hampden-Sydney
            College in Virginia, looked up one of the more obscure Latin words,
            consectetur, from a Lorem Ipsum passage, and going through the cites
            <br />
            <br />
            of the word in classical literature, discovered the undoubtable
            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
            Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
            Cicero, written in 45 BC. This book is a treatise on the theory of
            ethics, very popular during the Renaissance. The first line of Lorem
            Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section
            1.10.32.
          </section> */}
        </div>
      </article>
    </>
  )
}
