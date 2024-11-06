import { loadBookmarkedPosts } from '@/sanity/loader/loadQuery'
import { getUser } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'
import { BookmarkedQueryResult } from '@/utils/types/sanity/sanity.types'
import { redirect } from 'next/navigation'
import BookmarksLayout from './_components/BookmarksLayout'

export default async function Page() {
  const supabase = createClient()
  const user = await getUser(supabase)
  if (!user) {
    redirect('/redirect?url=/signin/password_signin')
  }
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('post_id')

  if (error) {
    return (
      <section className="flex flex-col">
        <div className="*:max-w-3xl *:mx-auto mx-auto my-36 px-4 space-y-24 *:flex *:flex-col *:items-center">
          <h1>Error loading bookmarks</h1>
        </div>
      </section>
    )
  }

  let posts: BookmarkedQueryResult | null = []

  if (bookmarks && bookmarks.length > 0) {
    const ids = bookmarks.map((bookmark) => bookmark.post_id)
    // freeze for 3 seconds to show skeleton
    const bookmarkedPosts = await loadBookmarkedPosts(ids)
    posts = bookmarkedPosts.data
  }

  return <BookmarksLayout posts={posts} />
}
