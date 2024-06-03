// accept optional key in props
export function GridWrapperDiv({
  key,
  children
}: {
  children: React.ReactNode
  key?: number
}) {
  return (
    <div
      key={key}
      className="grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0  screen-wide-short:grid-rows-1 "
    >
      {children}
    </div>
  )
}
