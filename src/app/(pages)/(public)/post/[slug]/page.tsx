import { loadPost } from '@/sanity/loader/loadQuery'
import { draftMode } from 'next/headers'
import PostPreview from './_components/PostPreview'
import { PostPage } from './_components/PostPage'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/queries'

type Props = {
  params: { slug: string }
}
export default async function ProjectSlugRoute({ params }: Props) {
  const initial = await loadPost(params.slug)

  // if (draftMode().isEnabled) {
  //   return <PostPreview params={params} initial={initial} />
  // }

  if (!initial.data) {
    notFound()
  }
  const supabase = createClient()
  const user = await getUser(supabase)

  return <PostPage data={initial.data} />
}
