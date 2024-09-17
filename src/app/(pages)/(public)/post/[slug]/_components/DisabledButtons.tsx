'use client'
import { Button } from '@/components/shadcn/ui/button'
import { BookmarkIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import BackButton from './BackButton'

export default function DisabledButtons() {
  const informUser = () => {
    // inform user that they need to be logged in to access this feature
    toast.warning('You need to be logged in to access this feature')
  }
  return (
    <div className="flex gap-2">
      <BackButton />
      <Button onClick={informUser}>PDF</Button>
      <Button
        variant={'outline'}
        className="flex items-center gap-1 leading-2 "
        onClick={informUser}
      >
        <BookmarkIcon width={16} height={16} />

        <span className="hidden md:block">Bookmark</span>
      </Button>
    </div>
  )
}
