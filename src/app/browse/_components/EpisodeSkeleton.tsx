import { Skeleton } from '@/components/shadcn/ui/skeleton'

export default function EpisodeSkeleton() {
  return (
    // depending on the ammount passed multiply the ammount of skeletons returned

    <Skeleton className="bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square" />
  )
}
