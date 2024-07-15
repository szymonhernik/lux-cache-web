import { Spotify } from 'react-spotify-embed'
export default function SpotifyEmbed({ url }: { url: string }) {
  return (
    <div className="max-w-screen-sm mx-auto py-4 flex justify-center">
      {typeof url === 'string' ? <Spotify wide link={url} /> : null}
    </div>
  )
}
