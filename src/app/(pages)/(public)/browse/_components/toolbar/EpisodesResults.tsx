import { SearchQueryResult } from '@/utils/types/sanity/sanity.types'
import Link from 'next/link'

type Props = {
  episodesResults: SearchQueryResult['posts']
}
export default function EpisodesResults(props: Props) {
  const { episodesResults } = props
  return (
    <div className="flex flex-col gap-4">
      {episodesResults.map((post) => (
        <Link href={`/post/${post.slug}`}>
          <div className="group space-y-1">
            {/* series name */}
            <div>
              {post.series &&
                post.series.length > 0 &&
                post.series.map((seriesItem, index) => (
                  <span
                    key={seriesItem._id}
                    className="opacity-50 group-hover:opacity-100 text-xs uppercase"
                  >
                    {seriesItem.title}
                    {index !== post.series!.length - 1 && ','}
                  </span>
                ))}
            </div>
            <h2 key={post._id} className="group-hover:underline">
              {post.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  )
}
