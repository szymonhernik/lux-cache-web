'use client'

import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'

export default function BrowsePageWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()

  const view = searchParams.get('view')
  return (
    <div
      className={clsx(
        ' lg:max-w-[calc(100vw-var(--width-navbar))] flex flex-col  bg-surface-brand',
        {
          'lg:h-auto ': view === 'list',
          'lg:max-h-screen lg:h-screen': !view
        }
      )}
    >
      {children}
    </div>
  )
}
