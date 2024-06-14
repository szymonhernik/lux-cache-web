import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'

export default function PostWrapper({
  children,
  key
}: {
  children: React.ReactNode
  key: string
}) {
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  return (
    <div
      key={key}
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
