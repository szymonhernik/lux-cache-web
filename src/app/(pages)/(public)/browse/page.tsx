import 'server-only'
import { Suspense } from 'react'
import { loadInitalPosts } from '@/sanity/loader/loadQuery'

import BrowsePage from './_components/main/BrowsePage'
import { limitNumber } from '@/utils/fetch-helpers/client'
import { LoadingSpinner } from '@/components/Spinner'

export default function Page() {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      <BrowsePageContent />
    </Suspense>
  )
}
function SpinnerContainer() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  )
}

async function BrowsePageContent() {
  const paginationParams = {
    lastPublishedAt: null,
    lastId: null,
    limit: limitNumber
  }
  const initial = await loadInitalPosts(paginationParams)

  return <BrowsePage data={initial.data} isDraftMode={false} />
}
