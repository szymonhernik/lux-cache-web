'use client'

import { removeBookmark } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { handleRequest } from '@/utils/auth-helpers/client'

type RemoveBookmarkButtonProps = {
  postId: string
}

export default function RemoveBookmarkButton({
  postId
}: RemoveBookmarkButtonProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await handleRequest(e, removeBookmark, router)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
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
