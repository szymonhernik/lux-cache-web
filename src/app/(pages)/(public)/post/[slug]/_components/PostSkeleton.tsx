import { Button } from '@/components/shadcn/ui/button'
import { LoadingSpinner } from '@/components/Spinner'
import { BookmarkIcon } from '@radix-ui/react-icons'

export default function PostSkeleton() {
  return (
    <>
      <div className="flex items-center gap-4 p-4 sticky top-0 left-0 flex-row-reverse md:flex-row justify-between md:justify-start z-[10]">
        <div className="flex gap-2">
          <Button disabled={true}>PDF</Button>
          <Button
            variant={'outline'}
            className="flex items-center gap-1 leading-2 "
            disabled={true}
          >
            <BookmarkIcon width={16} height={16} />

            <span className="hidden md:block">Bookmark</span>
          </Button>
        </div>

        {/* <h1 className="text-shadow text-sm w-64 h-6 bg-secondary-foreground/10 rounded-sm animate-pulse font-semibold"></h1> */}
      </div>
      <LoadingSpinner className="my-36 animate-spin mx-auto" size={32} />
    </>
  )
}
