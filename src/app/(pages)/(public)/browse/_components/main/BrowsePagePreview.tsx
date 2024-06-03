// @ts-nocheck
'use client'

import { type QueryResponseInitial } from '@sanity/react-loader'

import { useQuery } from '@/sanity/loader/useQuery'

import { PostsPayload } from '@/utils/types/sanity'
import { initialPostsQuery, postsQuery } from '@/sanity/lib/queries'

import {
  InitialPostsQueryResult,
  PostsQueryResult
} from '@/utils/types/sanity/sanity.types'
import BrowsePage from './BrowsePage'
import ListItem from '../ListItem'

type Props = {
  initial: QueryResponseInitial<PostsQueryResult | null>
}

export default function BrowsePagePreview(props: Props) {
  const { initial } = props
  const { data, encodeDataAttribute } = useQuery<PostsQueryResult | null>(
    postsQuery,
    {},
    { initial }
  )

  return (
    <BrowsePage
      previewData={data!}
      encodeDataAttribute={encodeDataAttribute}
      isDraftMode={true}
    />
  )
}
