'use server'

import { loadMorePosts } from '@/sanity/loader/loadQuery'
import { unstable_cache } from 'next/cache'

export const getPosts = async (
  selectedFiltersArray: Array<string> | null,
  paginationParams: {
    lastPublishedAt: string | null
    lastId: string | null
    limit: number
  }
) => {
  try {
    const response = await loadMorePosts(selectedFiltersArray, paginationParams)
    const data = await response

    // console.log('response: ', response)

    return data
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}

export const getCachedPosts = unstable_cache(
  async (params) => getPosts(null, params),
  ['getPosts'] // Unique cache key parts
)
