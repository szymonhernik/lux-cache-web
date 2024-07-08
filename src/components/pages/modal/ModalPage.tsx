import EpisodePreview from '@/app/(pages)/(public)/browse/_components/post-preview/EpisodePreview'
import { Modal } from '@/app/(pages)/(public)/browse/preview/@modal/[slug]/modal'
import { CanAcessType } from '@/utils/types'

import { PostBySlugModalQueryResult } from '@/utils/types/sanity/sanity.types'
import { Suspense } from 'react'

type ModalProps = {
  data: PostBySlugModalQueryResult
  canAccess: CanAcessType
}
export default function ModalPage(props: ModalProps) {
  const { data, canAccess } = props
  return (
    <Suspense fallback={<h1>Loading..</h1>}>
      <Modal>
        {data && <EpisodePreview data={data} canAccess={canAccess} />}
      </Modal>
    </Suspense>
  )
}
