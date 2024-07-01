interface Props {
  filters: Array<{
    slug: string | null
  }> | null
  variantClass?: string
}
export default function FiltersPreview(props: Props) {
  const { filters, variantClass } = props
  return (
    <>
      {filters && filters.length > 0 ? (
        <div className={`mt-2 flex gap-2`}>
          {filters?.map((filter) => (
            <p
              className={`border-[1px]  px-2 py-1 w-fit border-black rounded-full min-h-8 flex items-center justify-center ${variantClass}`}
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
