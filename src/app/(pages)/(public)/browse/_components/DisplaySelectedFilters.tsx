'use client'

import { Button } from '@/components/shadcn/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DisplaySelectedFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filters = searchParams.get('filter')
  // filter=season8,production -> separated by comma
  const filtersArray = filters ? filters.split(',') : null

  return (
    <div className="flex items-center gap-2">
      {filtersArray?.map((filter) => (
        <div
          key={filter}
          className={`flex items-center border px-4 bg-black text-white gap-1 text-xs border-black uppercase rounded-3xl hover:bg-neutral-800`}
        >
          <p>{filter} </p>
          <button
            onClick={() => {
              const newFilters = filtersArray.filter((f) => f !== filter)
              //   if filtersArray is empty, remove the filter query param
              router.push(
                `/browse${newFilters.length ? `?filter=${newFilters.join(',')}` : ''}`
              )
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
