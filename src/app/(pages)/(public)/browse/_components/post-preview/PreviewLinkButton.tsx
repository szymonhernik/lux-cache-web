'use client'
import { Button } from '@/components/shadcn/ui/button'
import { useCallback, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/ui/tooltip'

export default function PreviewLinkButton({ slug }: { slug: string | null }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const shareLink = useCallback(() => {
    const postUrl = `${window.location.origin}/browse/preview/${slug}`

    if (
      navigator.share &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      navigator
        .share({
          title: 'Share Preview Link',
          url: postUrl
        })
        .catch((error) => console.error('Error sharing:', error))
    } else {
      navigator.clipboard
        .writeText(postUrl)
        .then(() => {
          setShowTooltip(true)
          setTimeout(() => setShowTooltip(false), 2000)
          console.log('Link copied to clipboard: ', postUrl)
        })
        .catch((error) => {
          console.error('Error copying link to clipboard: ', error)
        })
    }
  }, [slug])

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Button
            variant={'ghost'}
            onClick={shareLink}
            className="text-sm font-normal"
          >
            Share Preview Link
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          <p>Link copied to clipboard!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
