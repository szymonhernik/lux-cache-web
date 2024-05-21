'use client'

import { type QueryResponseInitial } from '@sanity/react-loader'

import { useQuery } from '@/sanity/loader/useQuery'

import { PostsPayload } from '@/utils/types/sanity'
import { postsQuery } from '@/sanity/lib/queries'

import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import BrowsePage from './BrowsePage'

type Props = {
  initial: QueryResponseInitial<InitialPostsQueryResult | null>
}

export default function BrowsePagePreview(props: Props) {
  const { initial } = props
  const { data, encodeDataAttribute } =
    useQuery<InitialPostsQueryResult | null>(postsQuery, {}, { initial })
  //   console.log('INITIAL', initial)
  //   console.log('INITIAL DATA', data)

  return <BrowsePage data={data!} encodeDataAttribute={encodeDataAttribute} />
}
