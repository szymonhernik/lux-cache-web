'use client'
import { PostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { QueryResponseInitial } from '@sanity/react-loader'
import ListItem from '../ListItem'
import { GridWrapperDiv } from '../GridWrapperDiv'
import { Suspense } from 'react'

export default function DraftModeGrid(props: {
  data: PostsQueryResult | null
}) {
  // const { data } = props
  const { data } = props
  const { posts } = data || {}
  // console.log('props: ', props)

  return (
    <div className="lg:flex">
      <GridWrapperDiv>
        {posts &&
          posts?.map((post, index) => {
            return (
              <div
                key={post._id}
                //   data-sanity={encodeDataAttribute?.('title')}
                className={`w-full lg:w-[calc((80vh-4rem)/2)]  screen-wide-short:w-[calc(80vh-4rem)] aspect-square  `}
              >
                <Suspense>{/* <ListItem item={post} /> */}</Suspense>
              </div>
            )
          })}
      </GridWrapperDiv>
      {/* <button onClick={() => fetchNextPage()}>Load More</button> */}
    </div>
  )
}
