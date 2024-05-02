import { artists, episodes, series, tags } from './placeholder-data'

function fetchData(query) {
  if (!query) {
    return
  }
  const searchResults = {
    episodes: episodes.filter((episode) =>
      episode.title.toLowerCase().includes(query.toLowerCase())
    ),
    series: series.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
    ),
    artists: artists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase()) ||
        artist.bio.toLowerCase().includes(query.toLowerCase())
    ),
    tags: tags.filter((tag) =>
      tag.name.toLowerCase().includes(query.toLowerCase())
    )
  }
  return searchResults
}

export { fetchData }
