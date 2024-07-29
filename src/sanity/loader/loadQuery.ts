import 'server-only'

import * as queryStore from '@sanity/react-loader'
import { draftMode } from 'next/headers'

import { token } from '@/sanity/lib/token'
import {
  PagePayload,
  PostPayload,
  PostsPayload,
  ProjectPayload,
  SettingsPayload
} from '@/utils/types/sanity'
import {
  bookmarkedQuery,
  filterGroupsQuery,
  initialPostsQuery,
  morePostsQuery,
  pageBySlugQuery,
  postBySlugModalQuery,
  postBySlugQuery,
  postsByArtistSlugQuery,
  postsBySeriesSlugQuery,
  postsQuery,
  pricesQuery,
  settingsQuery
} from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import {
  BookmarkedQueryResult,
  FilterGroupsQueryResult,
  InitialPostsQueryResult,
  PostBySlugModalQueryResult,
  PostBySlugQueryResult,
  PostsByArtistSlugQueryResult,
  PostsBySeriesSlugQueryResult,
  PostsQueryResult,
  PricesQueryResult
} from '@/utils/types/sanity/sanity.types'

const serverClient = client.withConfig({
  token,
  // Enable stega if it's a Vercel preview deployment, as the Vercel Toolbar has controls that shows overlays
  stega: process.env.VERCEL_ENV === 'preview'
})

/**
 * Sets the server client for the query store, doing it here ensures that all data fetching in production
 * happens on the server and not on the client.
 * Live mode in `sanity/presentation` still works, as it uses the `useLiveMode` hook to update `useQuery` instances with
 * live draft content using `postMessage`.
 */
queryStore.setServerClient(serverClient)

const usingCdn = serverClient.config().useCdn
// Automatically handle draft mode
export const loadQuery = ((query, params = {}, options = {}) => {
  const {
    perspective = draftMode().isEnabled ? 'previewDrafts' : 'published'
  } = options
  // Don't cache by default
  let revalidate: NextFetchRequestConfig['revalidate'] = 0
  // If `next.tags` is set, and we're not using the CDN, then it's safe to cache
  if (!usingCdn && Array.isArray(options.next?.tags)) {
    revalidate = false
  } else if (usingCdn) {
    revalidate = 60
  }
  return queryStore.loadQuery(query, params, {
    ...options,
    next: {
      revalidate,
      ...(options.next || {})
    },
    perspective,
    // Enable stega if in Draft Mode, to enable overlays when outside Sanity Studio
    stega: draftMode().isEnabled
  })
}) satisfies typeof queryStore.loadQuery

/**
 * Loaders that are used in more than one place are declared here, otherwise they're colocated with the component
 */

export function loadSettings() {
  return loadQuery<SettingsPayload>(
    settingsQuery,
    {},
    { next: { tags: ['settings', 'home', 'page'] } }
  )
}

// export function loadHomePage() {
//   return loadQuery<HomePagePayload | null>(
//     homePageQuery,
//     {},
//     { next: { tags: ['home', 'project'] } },
//   )
// }
export function loadPosts() {
  return loadQuery<PostsQueryResult | null>(
    postsQuery,
    {},
    { next: { tags: ['post'] } }
  )
}
export function loadBookmarkedPosts(ids = [] as Array<string>) {
  return loadQuery<BookmarkedQueryResult | null>(
    bookmarkedQuery,
    { ids },
    { next: { revalidate: 0 } }
  )
}
export function loadArtistsPosts(slug: string) {
  return loadQuery<PostsByArtistSlugQueryResult | null>(
    postsByArtistSlugQuery,
    { slug },
    // { next: { revalidate: 0 } }
    { next: { tags: [`post`, `artist:${slug}`] } }
  )
}
export function loadSeriesPosts(slug: string) {
  return loadQuery<PostsBySeriesSlugQueryResult | null>(
    postsBySeriesSlugQuery,
    { slug },
    // { next: { revalidate: 0 } }
    { next: { tags: [`post`, `series:${slug}`] } }
  )
}
export function loadFilterGroups() {
  return loadQuery<FilterGroupsQueryResult | null>(
    filterGroupsQuery,
    {},
    { next: { tags: ['filterGroup', 'filterItem'] } }
  )
}
export function loadInitalPosts(paginationParams: {
  lastPublishedAt: string | null
  lastId: string | null
  limit: number
}) {
  return loadQuery<InitialPostsQueryResult | null>(
    initialPostsQuery,
    {
      lastPublishedAt: paginationParams.lastPublishedAt,
      lastId: paginationParams.lastId,
      limit: paginationParams.limit
    },
    { next: { tags: ['post'] } }
  )
}

export function loadMorePosts(
  selectedFiltersArray: Array<string> | null,
  paginationParams: {
    lastPublishedAt: string | null
    lastId: string | null
    limit: number
  }
) {
  return loadQuery<InitialPostsQueryResult | null>(
    morePostsQuery,
    {
      selectedFiltersArray,
      lastPublishedAt: paginationParams.lastPublishedAt,
      lastId: paginationParams.lastId,
      limit: paginationParams.limit
    },
    { next: { tags: ['post'] } }
  )
}

export function loadPost(slug: string) {
  return loadQuery<PostBySlugQueryResult | null>(
    postBySlugQuery,
    { slug },
    { next: { tags: [`post:${slug}`] } }
  )
}
export function loadPrices() {
  return loadQuery<PricesQueryResult | null>(
    pricesQuery,
    {},
    { next: { tags: [`pricing`] } }
  )
}
export function loadPostModal(slug: string) {
  return loadQuery<PostBySlugModalQueryResult | null>(
    postBySlugModalQuery,
    { slug },
    { next: { tags: [`post:${slug}`] } }
  )
}

export function loadPage(slug: string) {
  return loadQuery<any | null>(
    pageBySlugQuery,
    { slug },
    { next: { tags: [`page:${slug}`] } }
  )
}
