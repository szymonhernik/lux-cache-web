import { Suspense } from 'react'
import Search from './Search'
import Filter from './Filter'
import DisplaySelectedFilters from './DisplaySelectedFilters'

export default async function Toolbar() {
  return (
    <>
      <div className="flex items-center">
        <Suspense fallback={<div>Loading...</div>}>
          <Filter />
        </Suspense>
        <Suspense>
          <DisplaySelectedFilters />
        </Suspense>
      </div>
      <div className="flex items-center gap-4">
        <button aria-label="Switch View" className="opacity-70">
          View
        </button>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Search />
          </Suspense>
        </div>
      </div>
    </>
  )
}
