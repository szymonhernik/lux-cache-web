import { Modal } from '@/app/(pages)/(public)/browse/@modal/[slug]/modal'
import EpisodePreview from '@/app/(pages)/(public)/browse/_components/post-preview/EpisodePreview'

import { PostBySlugQueryResult } from '@/utils/types/sanity/sanity.types'
import { Suspense } from 'react'

type ModalProps = {
  data: PostBySlugQueryResult
  canAccess: boolean | 'loading'
}
export default function ModalPage(props: ModalProps) {
  const { data, canAccess } = props
  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      {/* @ts-ignore */}
      <Modal>
        {/* @ts-ignore */}
        {data && <EpisodePreview data={data} canAccess={canAccess} />}
      </Modal>
    </Suspense>
  )
}
