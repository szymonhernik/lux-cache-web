import { Suspense } from 'react'
import { posts } from '../../_components/postsTestData'
import { Modal } from './modal'
import Link from 'next/link'
import { loadPost } from '@/sanity/loader/loadQuery'
import { SinglePostType } from '@/utils/types/sanity'
import { Button, buttonVariants } from '@/components/shadcn/ui/button'

type EpisodeProps = {
  data: SinglePostType
}
async function Episode(props: EpisodeProps) {
  const { data } = props
  const { title, publishedAt, filters, ogDescription, slug } = data

  return (
    <div className="bg-white rounded-sm w-96 h-96">
      <div className="flex justify-end p-4">
        <Link href="/browse">close</Link>
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

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = await loadPost(slug)
  const { data } = post || {}

  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      <Modal>
        <h1> fetching</h1>
        {data && <Episode data={data} />}
      </Modal>
    </Suspense>
  )
}
