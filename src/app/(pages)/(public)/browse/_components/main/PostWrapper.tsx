import { PreviewVideoType } from '@/utils/types/sanity'
import { useHover } from '@mantine/hooks'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PostWrapper({
  children,
  postPreviewVideo,
  onHover,
  postId,

  isDesktop
}: {
  children: React.ReactNode
  postPreviewVideo: any
  postId: string

  onHover: (previewVideoPassed: PreviewVideoType) => void
  isDesktop: boolean
}) {
  // console.log('key:', postId)

  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const { hovered, ref } = useHover()
  // console.log('view:', view)

  useEffect(() => {
    if (hovered && isDesktop && view === 'list') {
      // console.log('hovered')
      // console.log('on video: ', postPreviewVideo)

      onHover(postPreviewVideo)
    }
  }, [hovered, isDesktop, view])
  return (
    <div
      ref={ref}
      key={postId}
      className={clsx(
        'w-full odd:bg-[#D4CACF] even:bg-surface-brand hover:opacity-80',
        {
          'lg:aspect-[3/1]  lg:max-h-64 ': view === 'list',
          'aspect-square lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)]':
            !view
        }
      )}
    >
      {children}
    </div>
  )
}
