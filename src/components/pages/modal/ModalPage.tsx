import EpisodePreview from '@/app/(pages)/(public)/browse/_components/post-preview/EpisodePreview'
import { Modal } from '@/app/(pages)/(public)/browse/preview/@modal/[slug]/modal'

import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { Suspense } from 'react'

type ModalProps = {
  data: PostBySlugQueryResult
  canAccess: boolean | 'loading'
}
export default function ModalPage(props: ModalProps) {
  console.log('Modal Modal')

  const { data, canAccess } = props
  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      <Modal>
        {/* @ts-ignore */}
        {data && <EpisodePreview data={data} canAccess={canAccess} />}
      </Modal>
    </Suspense>
  )
}
