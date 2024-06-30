'use client'

import { type QueryResponseInitial } from '@sanity/react-loader'

import { useQuery } from '@/sanity/loader/useQuery'

import { PostPayload } from '@/utils/types/sanity'
import { pageBySlugQuery } from '@/sanity/lib/queries'
import { PageBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { PageLayout } from './PageLayout'

type Props = {
  params: { slug: string }
  initial: QueryResponseInitial<PageBySlugQueryResult | null>
}

export default function PagePreview(props: Props) {
  const { params, initial } = props
  const { data, encodeDataAttribute } = useQuery<PageBySlugQueryResult | null>(
    pageBySlugQuery,
    params,
    { initial }
  )

  return <PageLayout data={data!} encodeDataAttribute={encodeDataAttribute} />
}
