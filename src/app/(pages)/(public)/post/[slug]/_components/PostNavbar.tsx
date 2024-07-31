import { Button } from '@/components/shadcn/ui/button'
import { BookmarkIcon } from '@radix-ui/react-icons'
import BookmarkButton from './BookmarkButton'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/queries'

interface Props {
  title: string | null | undefined
  post_id: string
}
export default async function PostNavbar(props: Props) {
  const { title, post_id } = props
  const supabase = createClient()
  const user = await getUser(supabase)
  //freeze for 3 seconds

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('post_id', post_id)

  const userHasBookmarked = bookmarks && bookmarks.length > 0 ? true : false

  return (
    <>
      <div className="flex gap-2">
        {user && post_id && (
          <>
            <Button>PDF</Button>
            <BookmarkButton
              post_id={post_id}
              bookmarks={bookmarks}
              userHasBookmarked={userHasBookmarked}
            />
          </>
        )}
      </div>
    </>
  )
}
