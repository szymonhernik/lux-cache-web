import { Suspense } from 'react'
import Search from './Search'
import Filter from './Filter'
import DisplaySelectedFilters from './DisplaySelectedFilters'
import SwitchView from './SwitchView'

export default async function Toolbar({
  resultsPage
}: {
  resultsPage?: boolean
}) {
  return (
    <>
      <div className="flex items-center">
        {!resultsPage && (
          <>
            <Suspense fallback={<div>Loading...</div>}>
              <Filter />
            </Suspense>
            <Suspense>
              <DisplaySelectedFilters />
            </Suspense>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Suspense>
          <SwitchView />
        </Suspense>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Search />
          </Suspense>
        </div>
      </div>
    </>
  )
}
