import { fetchDataByCategory } from '@/utils/fetch-helpers/server'
import ResultsPage from './_components/ResultsPage'

export default async function Page({ params }: { params: { slug: string } }) {
  const [category, identifier] = params.slug

  const initial = await fetchDataByCategory(category, identifier)

  if (!initial || initial?.data?.results === null) {
    return <h1>Not found</h1>
  }

  return <ResultsPage data={initial.data} isDraftMode={false} />
}
