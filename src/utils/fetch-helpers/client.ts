import { client } from '@/sanity/lib/client'
import {
  FilterByTagsQueryResult,
  MorePostsQueryResult,
  SearchQueryResult
} from '../types/sanity/sanity.types'
import {
  filterByTagsQuery,
  morePostsQuery,
  searchQuery,
  searchQueryDefault
} from '@/sanity/lib/queries'
import { SinglePostType } from '../types/sanity'

import { getUserTier } from '../supabase/queries'
import { createClient } from '../supabase/client'

export const limitNumber = 20

export const fetchMorePosts = async (
  selectedFiltersArray: Array<string> | null,
  paginationParams: {
    lastPublishedAt: string | null
    lastId: string | null
    limit: number
  }
) => {
  // console.log('selectedFiltersArray: ', selectedFiltersArray)
  // await new Promise((resolve) => setTimeout(resolve, 3000))

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

export const getSearchResults = async (searchValue: string | null) => {
  // artists (get from artists)
  // episodes (posts)
  // series (get from episodes)
  // tags (get from episodes)
  const result = searchValue
    ? await client.fetch(searchQuery, { searchValue })
    : await client.fetch(searchQueryDefault)

  return result as SearchQueryResult
}
export const getFilteredPosts = async (tagsSelected: string[]) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const result = await client.fetch(filterByTagsQuery, { tagsSelected })
  return result as FilterByTagsQueryResult
}

export const fetchSubscriptions = async () => {
  const supabase = createClient()
  console.log('Fetching subscriptions')
  // await new Promise((resolve) => setTimeout(resolve, 5000))

  const userTierObject = await getUserTier(supabase)

  return userTierObject?.userTier
}
