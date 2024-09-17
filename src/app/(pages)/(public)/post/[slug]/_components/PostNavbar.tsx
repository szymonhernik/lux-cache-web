import { Button } from '@/components/shadcn/ui/button'
import { BookmarkIcon } from '@radix-ui/react-icons'
import BookmarkButton from './BookmarkButton'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/utils/supabase/queries'

import DisabledButtons from './DisabledButtons'
import DownloadPDFButton from './DownloadPDFButton'
import BackButton from './BackButton'

interface Props {
  title: string | null | undefined
  post_id: string
  pdfUrl: string | null | undefined
}
export default async function PostNavbar(props: Props) {
  const { title, post_id, pdfUrl } = props
  const supabase = createClient()
  const user = await getUser(supabase)

  //if no user return PDF button only
  if (!user) {
    return <DisabledButtons />
  }

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
            <BackButton />
            {pdfUrl && <DownloadPDFButton url={pdfUrl} />}
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
