// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export function EpisodeSkeleton() {
  return (
    <div
      className={`${shimmer} overflow-hidden relative bg-gray-200  w-full lg:w-[calc((80vh-4rem)/2)]  wide-short:w-[calc(80vh-4rem)] aspect-square`}
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
