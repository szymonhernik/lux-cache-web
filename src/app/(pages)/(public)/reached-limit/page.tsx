import ErrorMessage from '@/components/ui/ErrorMessage'

export default function ReachedLimit() {
  return (
    <ErrorMessage
      title="Reached limit"
      message="It looks like you've reached the limit for making requests. Please try again later."
    />
  )
}
