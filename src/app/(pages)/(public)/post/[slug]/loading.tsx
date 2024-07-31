import { LoadingSpinner } from '../../../../../components/Spinner'

export default function Loading() {
  return (
    <div className="my-36 max-w-2xl mx-auto divide-y grid gap-4 px-4 text-center">
      <LoadingSpinner className="animate-spin mx-auto" size={32} />
    </div>
  )
}
