import { Button } from '@/components/shadcn/ui/button'
import { PostPayload } from '@/utils/types/sanity'
import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { BookmarkIcon } from '@radix-ui/react-icons'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import React from 'react'
import FiltersPreview from '../../../browse/_components/post-preview/FilterPreview'
import ContentOverview from './ContentOverview'
import PostNavbar from './PostNavbar'
import Link from 'next/link'
import ContentHeadlines from './ContentHeadlines'
import VideoThroughCDNTest from './VideoThroughCDNTest'

export interface PostPageProps {
  data: PostBySlugQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}
export function PostPage({ data, encodeDataAttribute }: PostPageProps) {
  const {
    title,
    publishedAt,
    artistList,
    filters,
    coverVideoMux,
    previewVideo
  } = data ?? {}

  return (
    <article className="flex flex-col ">
      {/* Post navbar */}
      <div className="flex items-center gap-4 p-4 sticky top-0 left-0 flex-row-reverse md:flex-row justify-between md:justify-start">
        <PostNavbar title={title} />
      </div>
      {/* Post content */}
      <div className="*:max-w-3xl *:mx-auto mx-auto my-36 px-4  space-y-24 *:flex *:flex-col *:items-center  ">
        {previewVideo && (
          <section>
            <VideoThroughCDNTest previewVideo={previewVideo} />
          </section>
        )}
        <section className="gap-8 !max-w-4xl">
          <ContentOverview publishedAt={publishedAt} filters={filters} />
        </section>
        <section className=" gap-16 items-center w-full  ">
          <ContentHeadlines title={title} artistList={artistList} />
        </section>
        <div className="">
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
          section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply
          random text. It has roots in a piece of classical Latin literature
          from 45 BC, making it over 2000 years old. Richard McClintock, a Latin
          professor at Hampden-Sydney College in Virginia, looked up one of the
          more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
          going through the cites of the word in classical literature,
          discovered the undoubtable source.
          <br />
          <br />
          Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus
          Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written
          in 45 BC. This book is a treatise on the theory of ethics, very
          popular during the Renaissance. The first line of Lorem Ipsum, "Lorem
          ipsum dolor sit amet..", comes from a line in section 1.10.32.
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
          section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply
          random text. It has roots in a piece of classical Latin literature
          from 45 BC, making it over 2000 years old. Richard McClintock, a Latin
          professor at Hampden-Sydney College in Virginia, looked up one of the
          more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
          going through the cites
          <br />
          <br />
          of the word in classical literature, discovered the undoubtable
          source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de
          Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
          written in 45 BC. This book is a treatise on the theory of ethics,
          very popular during the Renaissance. The first line of Lorem Ipsum,
          "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
        </div>
      </div>
    </article>
  )
}
