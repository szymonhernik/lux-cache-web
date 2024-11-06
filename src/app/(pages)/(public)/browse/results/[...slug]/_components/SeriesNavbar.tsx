import {
  PostsBySeriesSlugQueryResult
} from '@/utils/types/sanity/sanity.types'

import Breadcrumbs from '../../../../_components/Breadcrumbs'

interface Props {
  results: PostsBySeriesSlugQueryResult['results']
}
export default function SeriesNavbar(props: Props) {
  const { results } = props
  const title = results?.title
  const slug = results?.slug
  const pathnames = [
    { name: 'browse', path: '/browse' },
    { name: title ? `RESULTS: ${title}` : 'series title' }
  ]

  return (
    <>
      <div className=" relative w-full  h-full flex flex-col  ">
        <div className="  p-4">
          <Breadcrumbs pathnames={pathnames} />
        </div>
        <div className="w-full  p-4    items-center overflow-y-auto">
          <p className="text-neutral-500">results for:</p>
          {title && <h2 className="italic font-semibold">{title}</h2>}
        </div>
      </div>
    </>
  )
}
