import { useHover } from '@mantine/hooks'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PostWrapper({
  children,
  postId,
  onHover
}: {
  children: React.ReactNode
  postId: string
  onHover: (postId: string) => void
}) {
  // console.log('key:', postId)

  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const { hovered, ref } = useHover()
  useEffect(() => {
    if (hovered) {
      onHover(postId)
    }
  }, [hovered])
  return (
    <div
      ref={ref}
      key={postId}
      className={clsx('w-full  ', {
        'aspect-[3/1]': view === 'list',
        'aspect-square lg:w-[calc((80vh-4rem)/2)] screen-wide-short:w-[calc(80vh-4rem)]':
          !view
      })}
    >
      {children}
    </div>
  )
}
