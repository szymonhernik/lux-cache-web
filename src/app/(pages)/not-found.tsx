import ErrorMessage from '@/components/ui/ErrorMessage'

export default function NotFound() {
  return (
    <ErrorMessage
      title="404 - Page Not Found"
      message="The page you are looking for does not exist."
    />
  )
}
