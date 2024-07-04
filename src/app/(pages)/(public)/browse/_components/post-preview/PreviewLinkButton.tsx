import { Button } from '@/components/shadcn/ui/button'
import { useCallback } from 'react'

export default function PreviewLinkButton({ slug }: { slug: string | null }) {
  const copyToClipboard = useCallback(() => {
    const postUrl = `${window.location.origin}/browse/preview/${slug}`
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        console.log('Link copied to clipboard: ', postUrl)
      })
      .catch((error) => {
        console.error('Error copying link to clipboard: ', error)
      })
  }, [slug])
  return (
    <Button
      variant={'ghost'}
      onClick={copyToClipboard}
      className="text-sm font-normal"
    >
      Share Preview Link
    </Button>
  )
}
