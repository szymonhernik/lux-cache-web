interface Props {
  filters:
    | Array<{
        slug: string | null | undefined
      }>
    | null
    | undefined
  variantClass?: string
  variantWrapperClass?: string
}
export default function FiltersPreview(props: Props) {
  const { filters, variantClass, variantWrapperClass } = props
  return (
    <>
      {filters && filters.length > 0 ? (
        <div
          className={`mt-2 flex flex-wrap justify-start gap-2 ${variantWrapperClass}`}
        >
          {filters?.map((filter) => (
            <p
              className={`border-[1px] text-nowrap	text-sm px-2  w-fit border-black rounded-full min-h-8 flex items-center justify-center ${variantClass}`}
              key={filter.slug}
            >
              {filter.slug}
            </p>
          ))}
        </div>
      ) : null}
    </>
  )
}
