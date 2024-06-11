import ImageBox from '@/components/ui/ImageBox'
import { SearchQueryResult } from '@/utils/types/sanity/sanity.types'
import Link from 'next/link'

type Props = {
  artistsResults: SearchQueryResult['artists']
}
export default function ArtistsResults(props: Props) {
  const { artistsResults } = props
  return (
    <div className="flex flex-col gap-2 ">
      {artistsResults.map((artist) => (
        <Link key={artist._id} href={`/artists/${artist.slug}`}>
          <div className=" h-56  group relative hover:bg-highlightGreen/20 w-full">
            {/* <div className="group- absolute h-56 w-[calc(100vw-2rem)] left-4 z-[-1]"></div> */}
            <div className=" py-8 h-full flex gap-4 px-4 lg:px-searchXPadding">
              <div className="w-72 h-full bg-pink-300 rounded-full overflow-hidden ">
                <ImageBox
                  image={artist.image}
                  size="30vw"
                  classesWrapper="relative aspect-[16/9]"
                  width={504}
                  height={280}
                />
              </div>

              <h2
                key={artist._id}
                className="pt-4 text-lg group-hover:underline"
              >
                {artist.name}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
