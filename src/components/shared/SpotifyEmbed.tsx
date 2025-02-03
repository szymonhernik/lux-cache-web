export default function SpotifyEmbed({ url }: { url: string }) {
  // Convert Spotify URL to embed URL format
  const getEmbedUrl = (spotifyUrl: string) => {
    // Handle different Spotify URL formats
    const regex =
      /spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/
    const match = spotifyUrl.match(regex)

    if (!match) return null

    const [, type, id] = match
    return `https://open.spotify.com/embed/${type}/${id}`
  }

  const embedUrl = typeof url === 'string' ? getEmbedUrl(url) : null

  return (
    <div className="w-full mx-auto py-4 flex justify-center">
      {embedUrl && (
        <iframe
          src={embedUrl}
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className=""
        />
      )}
    </div>
  )
}
