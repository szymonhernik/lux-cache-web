'use client'

import { createUrl } from '@/utils/helpers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function DisplaySelectedFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filters = searchParams.get('filter')
  const pathname = usePathname()
  // filter=season8,production -> separated by comma
  const filtersArray = filters ? filters.split(',') : null

  const handleFilterRemove = (filter: string) => {
    const newFilters = filtersArray!.filter((f) => f !== filter)
    const newParams = new URLSearchParams(searchParams.toString())
    if (newFilters.length) {
      newParams.set('filter', newFilters.join(','))
    } else {
      //   if filtersArray is empty, remove the filter query param
      newParams.delete('filter')
    }
    const newUrl = createUrl(pathname, newParams)

    router.push(newUrl)
  }

  return (
    <div className="flex items-center gap-2 fixed lg:static lg:flex-row lg:ml-2 top-[9rem] right-[1rem] flex-col justify-end">
      {filtersArray?.map((filter) => (
        <div
          key={filter}
          className={`flex items-center border px-4 bg-black text-white gap-1 text-xs border-black uppercase rounded-3xl hover:bg-neutral-800`}
        >
          <p>{filter} </p>
          <button
            onClick={() => {
              handleFilterRemove(filter)
            }}
            className="text-lg  pl-2"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
