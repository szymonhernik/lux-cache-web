'use client'
import { Button } from '@/components/shadcn/ui/button'
import { createClient } from '@/utils/supabase/client'

import { BookmarkIcon } from '@radix-ui/react-icons'
import { BookmarkFilledIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BookmarkButton(props: {
  post_id: string
  userHasBookmarked: boolean
  bookmarks: any
}) {
  const { post_id, bookmarks, userHasBookmarked } = props
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const handleBookmark = async () => {
    setIsSubmitting(true)

    const supabase = createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (user) {
      if (userHasBookmarked) {
        await supabase.from('bookmarks').delete().eq('post_id', post_id)
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, post_id: post_id })
      }
      router.refresh()
    }
    setIsSubmitting(false)
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
