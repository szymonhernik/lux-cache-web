import Link from 'next/link'

interface Props {
  title: string | null | undefined
  subtitle: string | null | undefined

  artistList:
    | Array<{
        _key: string
        artistRef: {
          name: string | null
          slug: string | null
        } | null
        additionalContext: string | null
      }>
    | null
    | undefined
}
export default function ContentHeadlines(props: Props) {
  const { title, artistList, subtitle } = props
  return (
    <div className="w-full space-y-2">
      <h1 className="text-center text-3xl tracking-tight text-pretty font-semibold uppercase">
        {title}
      </h1>
      {subtitle && (
        <h2 className="text-center text-lg tracking-tight text-pretty font-semibold uppercase">
          {subtitle}
        </h2>
      )}

      {artistList && artistList.length > 0 && (
        <p className="w-fit mx-auto italic ">
          with {` `}
          {artistList.map((artist, index) => (
            <span key={artist._key} className="font-neue">
              {artist.artistRef?.slug ? (
                <Link
                  href={`/artist/${artist.artistRef.slug}`}
                  className="underline"
                >
                  {artist.artistRef?.name}
                  {artist.additionalContext && ` ${artist.additionalContext}`}
                </Link>
              ) : (
                <>
                  {artist.artistRef?.name}
                  {artist.additionalContext && ` ${artist.additionalContext}`}
                </>
              )}
              {index < artistList.length - 1 && ' & '}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
