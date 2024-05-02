export default function SearchResults(props: { results: any }) {
  const { results } = props
  if (results) {
    return (
      <div className="space-y-14 *:flex *:flex-col *:gap-2">
        <div>
          <h1 className="uppercase font-semibold text-lg">Artists</h1>
          {results.artists && results.artists.length > 0 ? (
            <div>
              {results.artists.map((artist: any) => (
                <div key={artist.id}>
                  <p>{artist.name}</p>
                  <p>{artist.bio}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary-foreground">no results</div>
          )}
        </div>
        <div>
          <h1 className="uppercase font-semibold text-lg">Episodes</h1>
          {results.episodes && results.episodes.length > 0 ? (
            <div>
              {results.episodes.map((episode: any) => (
                <div key={episode.id}>
                  <p>{episode.title}</p>
                  <p>{episode.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary-foreground">no results</div>
          )}
        </div>
        <div>
          <h1 className="uppercase font-semibold text-lg">Series</h1>
          {results.series && results.series.length > 0 ? (
            <div>
              {results.series.map((series: any) => (
                <div key={series.id}>
                  <p>{series.title}</p>
                  <p>{series.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary-foreground">no results</div>
          )}
        </div>
        <div>
          <h1 className="uppercase font-semibold text-lg">Tags</h1>
          {results.tags && results.tags.length > 0 ? (
            <div>
              {results.tags.map((tag: any) => (
                <div key={tag.id}>
                  <p>{tag.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-secondary-foreground">no results</div>
          )}
        </div>
      </div>
    )
  }
}
