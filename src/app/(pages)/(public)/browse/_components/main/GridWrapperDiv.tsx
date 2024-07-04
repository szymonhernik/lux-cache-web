import clsx from 'clsx'

// accept optional key in props
export function GridWrapperDiv({
  key,
  children,
  view
}: {
  children: React.ReactNode
  key?: number
  view?: string | null
}) {
  return (
    <div
      key={key}
      className={clsx('', {
        ' flex flex-col': view === 'list',
        'screen-wide-short:grid-rows-1 grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0 ':
          !view
      })}
    >
      {children}
    </div>
  )
}
