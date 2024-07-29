import { loadPost } from '@/sanity/loader/loadQuery'
import { draftMode } from 'next/headers'
import PostPreview from './_components/PostPreview'
import { PostPage } from './_components/PostPage'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUser, getUserTier } from '@/utils/supabase/queries'
import { Suspense } from 'react'
import PostNavbar from './_components/PostNavbar'
import { canAccessPost } from '@/utils/helpers/subscriptionUtils'

type Props = {
  params: { slug: string }
}
export default async function ProjectSlugRoute({ params }: Props) {
  const initial = await loadPost(params.slug)

  if (draftMode().isEnabled) {
    return <PostPreview params={params} initial={initial} />
  }

  if (!initial.data) {
    notFound()
  }
  const supabase = createClient()
  const user = await getUser(supabase)
  const userTierObject = await getUserTier(supabase)
  const userTier = userTierObject?.userTier
  const canAccess = canAccessPost(userTier, initial.data.minimumTier)

  if (!canAccess) {
    redirect(`/browse/preview/${params.slug}`)
  }

  return (
    <>
      <div className="flex items-center gap-4 p-4 sticky top-0 left-0 flex-row-reverse md:flex-row justify-between md:justify-start z-[10]">
        <Suspense fallback={<h1>Loading navbar</h1>}>
          {initial.data._id && (
            <PostNavbar title={initial.data.title} post_id={initial.data._id} />
          )}
        </Suspense>
      </div>
      <PostPage data={initial.data} />
    </>
  )
}
