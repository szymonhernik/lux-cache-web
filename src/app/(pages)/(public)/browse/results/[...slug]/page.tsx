import { Suspense } from 'react'
import { fetchDataByCategory } from '@/utils/fetch-helpers/server'
import ResultsPage from './_components/ResultsPage'
import { LoadingSpinner } from '@/components/Spinner'

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      <ResultsPageContent params={params} />
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

async function ResultsPageContent({ params }: { params: { slug: string } }) {
  const [category, identifier] = params.slug
  const initial = await fetchDataByCategory(category, identifier)

  if (!initial || initial?.data?.results === null) {
    return <h1>Not found</h1>
  }

  return <ResultsPage data={initial.data} isDraftMode={false} />
}
