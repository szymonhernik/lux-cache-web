'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMorePosts } from '../fetch-helpers/client'
import { useSearchParams } from 'next/navigation'

interface PageParam {
  lastPublishedAt: string | null
  lastId: string | null
  limit: number
}

export const useInfinitePost = (
  selectedFiltersArray: Array<string> | null,
  lastPublishedAt: string | null,
  lastId: string | null,
  limit: number
) => {
  const searchParams = useSearchParams()
  const initialPageParams = searchParams.get('filter')
    ? { lastPublishedAt: null, lastId: null, limit }
    : { lastPublishedAt, lastId, limit }
  return useInfiniteQuery({
    queryKey: ['infinite'],
    staleTime: 10 * (60 * 1000), // 10 minutes
    // pass lastId and lastPublishedAt to the query function
    queryFn: ({
      pageParam = { lastPublishedAt, lastId, limit }
    }: {
      pageParam: PageParam
    }) => {
      console.log('pageParam: ', pageParam)
      console.log('selectedFiltersArray: ', selectedFiltersArray)

      return fetchMorePosts(selectedFiltersArray, pageParam)
    },
    // staleTime: 30000,
    // enabled: false,
    getNextPageParam: (lastPage) => {
      if (lastPage.length > 0) {
        const lastPost = lastPage[lastPage.length - 1]
        return {
          lastPublishedAt: lastPost.publishedAt,
          lastId: lastPost._id,
          limit
        }
      }
      return null // Indicates there are no more pages to load
    },
    initialPageParam: initialPageParams
  })
}
