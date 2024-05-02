export default function SearchResults() {
  return (
    <div className="space-y-14 *:flex *:flex-col *:gap-2">
      <div>
        <h1 className="uppercase font-semibold text-lg">Artists</h1>
        <div className="text-secondary-foreground">no results</div>
      </div>
      <div>
        <h1 className="uppercase font-semibold text-lg">Episodes</h1>
        <div className="text-secondary-foreground">no results</div>
      </div>
      <div>
        <h1 className="uppercase font-semibold text-lg">Series</h1>
        <div className="text-secondary-foreground">no results</div>
      </div>
      <div>
        <h1 className="uppercase font-semibold text-lg">Tags</h1>
        <div className="text-secondary-foreground">no results</div>
      </div>
    </div>
  )
}
