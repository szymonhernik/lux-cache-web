import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import {
  MorePostsQueryResult,
  PostsQueryResult
} from '../types/sanity/sanity.types'
import { morePostsQuery } from '@/sanity/lib/queries'
import { SinglePostType } from '../types/sanity'

const fetchMorePosts = async (
  selectedFiltersArray: Array<string> | null,
  paginationParams: {
    lastPublishedAt: string | null
    lastId: string | null
    limit: number
  }
) => {
  const result: MorePostsQueryResult = await client.fetch(morePostsQuery, {
    selectedFiltersArray,
    lastPublishedAt: paginationParams.lastPublishedAt,
    lastId: paginationParams.lastId,
    limit: paginationParams.limit
  })
  const newPosts = result.posts

  console.log('Fetching new data')

  // if (newPosts.length > 0) {
  //   paginationParams.lastPublishedAt = newPosts[newPosts.length - 1].publishedAt
  //   paginationParams.lastId = newPosts[newPosts.length - 1]._id
  // } else {
  //   paginationParams.lastId = null // Reached the end
  // }

  const posts = newPosts as SinglePostType[]

  return posts
}

export { fetchMorePosts }
