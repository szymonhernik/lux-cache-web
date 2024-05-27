import { loadPost } from '@/sanity/loader/loadQuery'

import ModalPage from '@/components/pages/modal/ModalPage'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = await loadPost(slug)
  const { data } = post || {}

  return <ModalPage data={data} />
}
