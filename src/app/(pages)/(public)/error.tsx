'use client'
import ErrorMessage from '@/components/ui/ErrorMessage'

// Error boundaries must be Client Components

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorMessage title="Something went wrong!" message={error.message}>
      <button onClick={() => reset()}>Try again</button>
    </ErrorMessage>
  )
}
