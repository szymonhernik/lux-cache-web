import { Button } from '@/components/shadcn/ui/button'
import { BookmarkIcon } from '@radix-ui/react-icons'

interface Props {
  title: string | null | undefined
}
export default function PostNavbar(props: Props) {
  const { title } = props
  return (
    <>
      <div className="flex gap-2">
        <Button>PDF</Button>
        <Button
          variant={'outline'}
          className="flex items-center gap-1 leading-2 "
        >
          <BookmarkIcon width={16} height={16} />{' '}
          <span className="hidden md:block">Bookmark</span>
        </Button>
      </div>
      <h1 className="text-shadow text-sm font-semibold">{title}</h1>
    </>
  )
}
