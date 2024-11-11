'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleRequest } from '@/utils/auth-helpers/client'
import { removeBookmark } from '@/utils/actions/bookmarks'
import { postIdSchema } from '@/utils/types/zod/bookmarks'
import { toast } from 'sonner'

type RemoveBookmarkButtonProps = {
  postId: string
}

export default function RemoveBookmarkButton({
  postId
}: RemoveBookmarkButtonProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRemoveBookmark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    //validate postId to be a uuid with zod
    const formData = new FormData(e.currentTarget)
    const postId = formData.get('postId') as string
    const { success } = postIdSchema.safeParse(postId)
    if (!success) {
      throw new Error('Invalid post ID format')
    }
    try {
      const redirectUrl = await removeBookmark(formData)
      router.push(redirectUrl)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleRemoveBookmark}>
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="text-sm mt-4 text-tertiary-foreground hover:text-black underline underline-offset-2"
      >
        {isSubmitting ? 'Removing...' : 'Remove'}
      </button>
    </form>
  )
}
