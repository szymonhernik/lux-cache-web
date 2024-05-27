import { buttonVariants } from '@/components/shadcn/ui/button'
import { SinglePostType } from '@/utils/types/sanity'
import Link from 'next/link'
import CloseButton from './CloseButton'
import { Suspense } from 'react'

type EpisodeProps = {
  data: SinglePostType
}
export default function Episode(props: EpisodeProps) {
  const { data } = props
  const { title, publishedAt, filters, ogDescription, slug } = data

  return (
    <div className="bg-white rounded-sm w-96 h-96">
      <div className="flex justify-end p-4">
        <Suspense>
          <CloseButton />
        </Suspense>
      </div>
      <div className="p-4">
        <h1 className="text-xl">{title}</h1>
        <p className="">{publishedAt}</p>

        <Link
          href={`/post/${slug}`}
          className={buttonVariants({ variant: 'default' })}
        >
          Read
        </Link>
      </div>
    </div>
  )
}
