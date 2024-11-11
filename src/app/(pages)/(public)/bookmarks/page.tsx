import { loadBookmarkedPosts } from '@/sanity/loader/loadQuery'
import { getBookmarks, getUser } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'
import { BookmarkedQueryResult } from '@/utils/types/sanity/sanity.types'
import { redirect } from 'next/navigation'
import BookmarksLayout from './_components/BookmarksLayout'
import { cache } from 'react'

const getBookmarkedPostsCached = cache(loadBookmarkedPosts)

export default async function Page() {
  const supabase = createClient()
  const [user, bookmarks] = await Promise.all([
    getUser(supabase),
    getBookmarks(supabase)
  ])

  if (!user) {
    redirect('/redirect?url=/signin/password_signin')
  }
  if (!bookmarks || bookmarks.error) {
    return 'There was an error.'
  }
  if (!bookmarks?.data?.length) {
    return <BookmarksLayout posts={[]} />
  }

  let posts: BookmarkedQueryResult = []

  if (bookmarks && bookmarks.data.length > 0) {
    const ids = bookmarks.data.map((bookmark) => bookmark.post_id)

    const bookmarkedPosts = await getBookmarkedPostsCached(ids) // Use cached version

    // Create a map of post_id to created_at for easy lookup
    const bookmarkDates = new Map(
      bookmarks.data.map((bookmark) => [bookmark.post_id, bookmark.created_at])
    )

    // Sort the bookmarkedPosts by the created_at date
    if (bookmarkedPosts.data) {
      posts = bookmarkedPosts.data?.sort((a, b) => {
        const dateA = bookmarkDates.get(a._id) || ''
        const dateB = bookmarkDates.get(b._id) || ''
        return dateB.localeCompare(dateA) // newest first
      })
    }
  }

  return <BookmarksLayout posts={posts} />
}
