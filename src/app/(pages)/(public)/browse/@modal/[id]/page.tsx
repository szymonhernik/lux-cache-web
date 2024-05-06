import { Suspense } from 'react'
import { posts } from '../../_components/postsTestData'
import { Modal } from './modal'
import Link from 'next/link'

async function Episode({ id }: { id: string }) {
  const parsedId = parseInt(id)

  const episode = posts.find((post) => post.id === parsedId)

  return (
    <div className="bg-white rounded-sm w-96 h-96">
      <div className="flex justify-end p-4">
        <Link href="/browse">close</Link>
      </div>
      <div className="p-4">
        <h1 className="text-xl">{episode?.content}</h1>
      </div>
    </div>
  )
}

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <Modal>
        <Episode id={id} />
      </Modal>
    </Suspense>
  )
}
