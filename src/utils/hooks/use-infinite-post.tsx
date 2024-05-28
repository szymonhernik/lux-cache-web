import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMorePosts } from '../fetch-helpers/client'

interface PageParam {
  lastPublishedAt: string | null
  lastId: string | null
  limit: number
}

export const useInfinitePost = (
  lastPublishedAt: string | null,
  lastId: string | null,
  limit: number
) => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['infinite'],
      // pass lastId and lastPublishedAt to the query function
      queryFn: ({
        pageParam = { lastPublishedAt, lastId, limit }
      }: {
        pageParam: PageParam
      }) => {
        return fetchMorePosts(null, pageParam)
      },
      enabled: false,
      getNextPageParam: (lastPage) => {
        if (lastPage.length > 0) {
          const lastPost = lastPage[lastPage.length - 1]
          return {
            lastPublishedAt: lastPost.publishedAt,
            lastId: lastPost._id,
            limit
          }
        }
        return undefined // Indicates there are no more pages to load
      },
      initialPageParam: { lastPublishedAt, lastId, limit: 8 } // Set the initial page parameter, important when using initialData
    })
  return { data, fetchNextPage, isFetchingNextPage, hasNextPage }
}
