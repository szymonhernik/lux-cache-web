import { LoadingSpinner } from '../Spinner'

export function SpinnerContainer() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  )
}
