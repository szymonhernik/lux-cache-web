import { loadPost } from '@/sanity/loader/loadQuery'
import { draftMode } from 'next/headers'
import PostPreview from './_components/PostPreview'
import { PostPage } from './_components/PostPage'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getUserRoles, getUserTier } from '@/utils/supabase/queries'
import { Suspense } from 'react'
import PostNavbar from './_components/PostNavbar'
import { canAccessPost } from '@/utils/helpers/subscriptionUtils'
import { Button } from '@/components/shadcn/ui/button'
import { BookmarkIcon } from '@radix-ui/react-icons'
import BackButton from './_components/BackButton'
import { unstable_cache } from 'next/cache'

type Props = {
  params: { slug: string }
}
export default async function ProjectSlugRoute({ params }: Props) {
  // Cache the Sanity post data
  const getCachedPost = unstable_cache(
    async (slug: string) => {
      const result = await loadPost(slug)
      return result
    },
    ['post-page'],
    {
      tags: [`post:${params.slug}`]
    }
  )
  const initial = await getCachedPost(params.slug)

  if (draftMode().isEnabled) {
    return <PostPreview params={params} initial={initial} />
  }

  if (!initial.data) {
    notFound()
  }
  const supabase = createClient()
  // const user = await getUser(supabase)
  const userTierObject = await getUserTier(supabase)
  const userRoles = await getUserRoles(supabase)
  const userTier = userTierObject?.userTier
  const canAccess = userRoles.includes('admin')
    ? true
    : canAccessPost(userTier, initial.data.minimumTier)

  if (!canAccess) {
    redirect(`/browse/preview/${params.slug}`)
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-4 p-4 sticky -top-16 left-0 flex-row-reverse md:flex-row justify-between md:justify-start z-[10]">
        <Suspense
          fallback={
            <div className="flex gap-2">
              <BackButton />
              <Button disabled={true}>PDF</Button>
              <Button
                variant={'outline'}
                className="flex items-center gap-1 leading-2 "
                disabled={true}
              >
                <BookmarkIcon width={16} height={16} />

                <span className="hidden md:block">Bookmark</span>
              </Button>
            </div>
          }
        >
          {initial.data._id && (
            <PostNavbar
              slug={params.slug}
              title={initial.data.title}
              post_id={initial.data._id}
              pdfUrl={initial.data.episodePDF?.file?.asset?.url}
            />
          )}
        </Suspense>

        <h1 className="text-shadow text-sm font-semibold">
          {initial.data.title}
        </h1>
      </div>
      <PostPage data={initial.data} userRoles={userRoles} />
    </div>
  )
}
