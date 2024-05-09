'use client'

import { type QueryResponseInitial } from '@sanity/react-loader'

import { useQuery } from '@/sanity/loader/useQuery'

import { PostPayload } from '@/utils/types/sanity'
import { postBySlugQuery } from '@/sanity/lib/queries'
import { PostPage } from './PostPage'
import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'

type Props = {
  params: { slug: string }
  initial: QueryResponseInitial<PostBySlugQueryResult | null>
}

export default function PostPreview(props: Props) {
  const { params, initial } = props
  const { data, encodeDataAttribute } = useQuery<PostBySlugQueryResult | null>(
    postBySlugQuery,
    params,
    { initial }
  )

  return <PostPage data={data!} encodeDataAttribute={encodeDataAttribute} />
}
