import { BookmarkedItemSkeleton } from '@/components/ui/skeletons/skeletons'

export default function Loading() {
  return (
    <div className="my-36 max-w-2xl mx-auto divide-y grid gap-4 px-4">
      <BookmarkedItemSkeleton />
      <BookmarkedItemSkeleton />
    </div>
  )
}
