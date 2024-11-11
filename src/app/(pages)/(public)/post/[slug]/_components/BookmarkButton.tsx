'use client'
import { Button } from '@/components/shadcn/ui/button'
import { toggleBookmark } from '@/utils/actions/bookmarks'

import { createClient } from '@/utils/supabase/client'

import { BookmarkIcon } from '@radix-ui/react-icons'
import { BookmarkFilledIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function BookmarkButton(props: {
  post_id: string
  userHasBookmarked: boolean
  slug: string
}) {
  const { post_id, userHasBookmarked, slug } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleBookmark = async () => {
    try {
      setIsSubmitting(true)
      await toggleBookmark(post_id, slug, userHasBookmarked)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Button
      variant={'outline'}
      className="flex items-center gap-1 leading-2 "
      disabled={isSubmitting}
      onClick={handleBookmark}
    >
      {userHasBookmarked ? (
        <BookmarkFilledIcon width={16} height={16} />
      ) : (
        <BookmarkIcon width={16} height={16} />
      )}
      {/* <BookmarkIcon width={16} height={16} />{' '} */}
      <span className="hidden md:block">Bookmark</span>
    </Button>
  )
}
