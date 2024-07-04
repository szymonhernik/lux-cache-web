import {
  PostsBySeriesSlugQueryResult,
  Slug
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
        <div className=" w-full  grow  py-4 flex flex-row items-center overflow-y-auto">
          {title && <h2>{title}</h2>}
        </div>
      </div>
    </>
  )
}
