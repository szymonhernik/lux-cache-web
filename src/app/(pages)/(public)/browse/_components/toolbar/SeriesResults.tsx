import { SearchQueryResult } from '@/utils/types/sanity/sanity.types'
import Link from 'next/link'

type Props = {
  seriesResults: SearchQueryResult['series']
}
export default function SeriesResults(props: Props) {
  const { seriesResults } = props
  return (
    <div className="flex flex-col gap-4 ">
      {seriesResults.map((series) => (
        <Link href={`/series/${series.slug}`}>
          <div className="group space-y-1 ">
            <h2 key={series._id} className="group-hover:underline">
              {series.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  )
}
