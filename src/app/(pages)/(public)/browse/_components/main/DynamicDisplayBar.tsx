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
    <Link href={`/browse/preview/${slug}`} className="w-1/2 h-full bg-blue-200">
      <div className="p-4 uppercase flex gap-4 h-full items-center">
        <div className="  aspect-square h-full max-h-32 ">
          <ImageBoxArticle
            image={coverImage}
            width={200}
            height={200}
            size="200px"
          />
        </div>
        <div className="h-full pt-2 pl-2">
          {' '}
          <p>Highlight</p>
          <p className="font-semibold">{title}</p>
        </div>
      </div>
    </Link>
  )
}
