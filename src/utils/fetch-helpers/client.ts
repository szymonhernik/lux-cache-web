import { client } from '@/sanity/lib/client'
import {
  MorePostsQueryResult,
  PostsQueryResult,
  SearchQueryResult
} from '../types/sanity/sanity.types'
import { morePostsQuery, searchQuery } from '@/sanity/lib/queries'
import { SinglePostType } from '../types/sanity'

export const limitNumber = 20

const fetchMorePosts = async (
  selectedFiltersArray: Array<string> | null,
  paginationParams: {
    lastPublishedAt: string | null
    lastId: string | null
    limit: number
  }
) => {
  // console.log('selectedFiltersArray: ', selectedFiltersArray)

  const result: MorePostsQueryResult = await client.fetch(morePostsQuery, {
    selectedFiltersArray: selectedFiltersArray,
    lastPublishedAt: paginationParams.lastPublishedAt,
    lastId: paginationParams.lastId,
    limit: paginationParams.limit
  })
  const newPosts = result.posts

  // console.log('Fetching new data')

  if (newPosts.length > 0) {
    paginationParams.lastPublishedAt = newPosts[newPosts.length - 1].publishedAt
    paginationParams.lastId = newPosts[newPosts.length - 1]._id
  } else {
    paginationParams.lastId = null // Reached the end
    console.log('Reached the end')
  }
  // console.log('newPosts ', newPosts)

  const posts = newPosts as SinglePostType[]

  return posts
}

const getSearchResults = async (searchValue: string) => {
  // freeze for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000))
  const result = await client.fetch(searchQuery, { searchValue })
  console.log('result: ', result)

  return result as SearchQueryResult
}

export { fetchMorePosts, getSearchResults }
