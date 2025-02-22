'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMorePosts } from '../fetch-helpers/client'
import { useSearchParams } from 'next/navigation'
import { sortSelectedFilters } from '../helpers'

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
  const initialPageParams = { lastPublishedAt, lastId, limit }
  const searchParams = useSearchParams()
  const isFiltered = searchParams.get('filter')

  // sort selectedFiltersArray alphabetically so that whatever order the user selects the filters in, the query key will be the same
  const sortedSelectedFiltersArray = sortSelectedFilters(selectedFiltersArray)

  return useInfiniteQuery({
    queryKey: ['infinite', sortedSelectedFiltersArray],
    staleTime: 4 * (60 * 1000), // 4 minutes
    queryFn: ({
      pageParam = { lastPublishedAt, lastId, limit }
    }: {
      pageParam: PageParam
    }) => {
      return fetchMorePosts(selectedFiltersArray, pageParam)
    },
    // if filters are present i want to fetch posts on rerender
    // if the app is in default (no filters) i don't want to fetch new posts, until i reach the element that triggers the fetch is in the viewport
    enabled: Boolean(isFiltered),
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
