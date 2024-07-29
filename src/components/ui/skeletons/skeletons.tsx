// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export function EpisodeSkeleton() {
  return (
    <div
      className={`${shimmer} overflow-hidden relative bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  screen-wide-short:w-[calc(80vh-4rem)] aspect-square`}
    ></div>
  )
}
export function EpisodeSkeletonListView() {
  return (
    <div
      className={`${shimmer} overflow-hidden relative bg-gray-200 hidden lg:block w-full lg:w-[30vw] lg:max-w-96   aspect-square`}
    ></div>
  )
}

export function EpisodesSkeletonTwo() {
  return (
    <>
      <EpisodeSkeleton />
      <EpisodeSkeleton />
    </>
  )
}

export function BookmarkedItemSkeleton() {
  return (
    <div className="flex justify-between gap-4 py-4 tracking-tight p-2 overflow-hidden relative">
      <div className="flex-1">
        <div
          className={`relative overflow-hidden font-semibold text-lg uppercase text-primary-foreground bg-gray-300 rounded h-6 w-3/4 ${shimmer}`}
        ></div>
        <div
          className={`relative overflow-hidden text-sm w-full sm:w-1/4 text-tertiary-foreground uppercase bg-gray-300 rounded h-4 mt-2 ${shimmer}`}
        ></div>
      </div>
      <div
        className={`relative overflow-hidden gap-2 w-28 h-28 bg-gray-300 rounded ${shimmer}`}
      ></div>
    </div>
  )
}
