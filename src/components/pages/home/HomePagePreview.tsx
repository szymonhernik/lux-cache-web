'use client'

import { type QueryResponseInitial } from '@sanity/react-loader'

import { useQuery } from 'sanity/loader/useQuery'

import { PostsPayload } from '@/utils/types/sanity'
import { postsQuery } from 'sanity/lib/queries'
import HomePage from './HomePage'

type Props = {
  initial: QueryResponseInitial<PostsPayload | null>
}

export default function HomePagePreview(props: Props) {
  const { initial } = props
  const { data, encodeDataAttribute } = useQuery<PostsPayload | null>(
    postsQuery,
    {},
    { initial }
  )

  return <HomePage data={data!} encodeDataAttribute={encodeDataAttribute} />
}
