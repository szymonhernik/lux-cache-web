'use client'
import { PostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { QueryResponseInitial } from '@sanity/react-loader'
import ListItem from './ListItem'

type Props = {
  data: QueryResponseInitial<PostsQueryResult | null>
}
export default function DraftModeGrid(props: Props) {
  const { data } = props
  console.log('data', data)

  return (
    <div className="lg:flex">
      <div className=" grid md:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:h-full lg:grid-rows-2 lg:w-min gap-0  screen-wide-short:grid-rows-1 ">
        {data?.map((post, index) => {
          return (
            <div
              key={post._id}
              //   data-sanity={encodeDataAttribute?.('title')}
              className={`w-full lg:w-[calc((80vh-4rem)/2)]  screen-wide-short:w-[calc(80vh-4rem)] aspect-square  `}
            >
              <ListItem item={post} />
            </div>
          )
        })}
      </div>

      {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
    </div>
  )
}
