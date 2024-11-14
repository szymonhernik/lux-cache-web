export default function AccountSkeleton() {
  return (
    <>
      {/* Account Header */}
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />

      {/* Forms Container */}
      <div className="divide-y flex flex-col gap-8 *:pt-8">
        {/* Name Form Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Email Form Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Password Form Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full max-w-md bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </>
  )
}
