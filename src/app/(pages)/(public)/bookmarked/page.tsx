import { loadBookmarkedPosts } from '@/sanity/loader/loadQuery'
import { getUser } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'
import { BookmarkedQueryResult } from '@/utils/types/sanity/sanity.types'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    const bookmarkedPosts = await loadBookmarkedPosts(ids)
    posts = bookmarkedPosts.data
  }

  return (
    <section className="flex flex-col">
      <div className="mx-auto container my-36 px-4  space-y-8  ">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            if (post.slug) {
              return (
                <Link key={post._id} href={`/post/${post.slug}`}>
                  <h2 className="font-semibold hover:underline">
                    {post.title}
                  </h2>
                </Link>
              )
            } else {
              return (
                <h2 key={post._id} className="font-semibold">
                  {post.title}
                </h2>
              )
            }
          })
        ) : (
          <h1>No bookmarks</h1>
        )}
      </div>
    </section>
  )
}
