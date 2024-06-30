import { loadPage } from '@/sanity/loader/loadQuery'
import PostPreview from '../post/[slug]/_components/PostPreview'
import PagePreview from './_components/PagePreview'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { PostPage } from '../post/[slug]/_components/PostPage'
import { PageLayout } from './_components/PageLayout'
import { generateStaticSlugs } from '@/sanity/loader/generateStaticSlugs'
import { Metadata, ResolvingMetadata } from 'next'
import { toPlainText } from 'next-sanity'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: page } = await loadPage(params.slug)

  return {
    title:
      (page?.title
        ? page.title.charAt(0).toUpperCase() + page.title.slice(1)
        : '') + ' | Lux Cache',
    description: page?.overview
      ? toPlainText(page.overview)
      : (await parent).description
  }
}

export function generateStaticParams() {
  return generateStaticSlugs('page')
}

export default async function PageBySlug({ params }: Props) {
  const initial = await loadPage(params.slug)

  if (draftMode().isEnabled) {
    return <PagePreview params={params} initial={initial} />
  }

  if (!initial.data) {
    notFound()
  }

  return <PageLayout data={initial.data} />
}
