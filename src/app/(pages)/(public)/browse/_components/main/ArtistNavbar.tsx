import ImageBox from '@/components/ui/ImageBox'
import { PostsByArtistSlugQueryResult } from '@/utils/types/sanity/sanity.types'
import Breadcrumbs from '../../../_components/Breadcrumbs'

interface Props {
  artistInfo: PostsByArtistSlugQueryResult['artistInfo']
}
export default function ArtistNavbar(props: Props) {
  const { artistInfo } = props

  const pathnames = [
    { name: 'browse', path: '/browse' },
    { name: 'artists' },
    { name: artistInfo?.name ? artistInfo.name : 'artist name' }
  ]

  return (
    <>
      <div className=" relative w-full  h-full flex flex-col">
        {/* <div className="group- absolute h-56 w-[calc(100vw-2rem)] left-4 z-[-1]"></div> */}

        <Breadcrumbs pathnames={pathnames} />

        <div className=" grow max-h-48 my-auto  flex flex-col lg:flex-row gap-4 px-4 ">
          <div className=" m-4  aspect-[16/9]  bg-pink-300 rounded-full overflow-hidden ">
            <ImageBox
              image={artistInfo?.image}
              size="(max-width: 768px) 100vw, 30vw"
              classesWrapper="relative aspect-[16/9]"
              width={504}
              height={280}
            />
          </div>

          <h2
            key={artistInfo?._id}
            className="pt-4 text-lg font-semibold italic group-hover:underline"
          >
            {artistInfo?.name}
          </h2>
        </div>
      </div>
    </>
  )
}
