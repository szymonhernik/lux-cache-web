import { loadArtistsPosts, loadSeriesPosts } from '@/sanity/loader/loadQuery'

export async function fetchDataByCategory(
  category: string,
  identifier: string
) {
  if (category === 'artists') {
    return await loadArtistsPosts(identifier)
  } else if (category === 'series') {
    return await loadSeriesPosts(identifier)
  } else {
    return null
  }
}
