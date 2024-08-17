import ImageBoxArticle from '@/components/shared/ImageBoxArticle'
import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import Link from 'next/link'

export interface Props {
  data: InitialPostsQueryResult['highlight']
}
export default function DynamicDisplayBar({ data }: Props) {
  const { title, coverImage, slug } = data?.highlight || {}
  if (!slug || !coverImage) return null
  return (
    <div className="w-full sm:w-3/4  h-full">
      <Link href={`/browse/preview/${slug}`} className=" ">
        <div className="px-4 py-6  flex gap-4 h-full items-center group ">
          <div className="  aspect-square h-full max-h-32 group-hover:opacity-80">
            <ImageBoxArticle
              image={coverImage}
              width={300}
              height={300}
              size="300px"
            />
          </div>
          <div className="h-full pt-4 pl-2 ">
            {' '}
            <p className="text-secondary-foreground">Highlight</p>
            <p className="font-semibold tracking-tight group-hover:opacity-80">
              {title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
