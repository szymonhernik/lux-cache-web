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
  // convert id to number
  //   const episodeId = parseInt(id, 10)
  //   console.log('episodeId', episodeId)

  return (
    <Suspense fallback={null}>
      {/* <div className="fixed top-0 left-0 z-[100000] h-screen w-screen bg-black/80 flex items-center justify-center">
        <Episode id={id} />
      </div> */}
      <Modal>
        <Episode id={id} />
      </Modal>
    </Suspense>
  )
}
