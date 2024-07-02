import 'server-only'

import { loadArtistsPosts } from '@/sanity/loader/loadQuery'
import ArtistPage from './_components/ArtistPage'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params

  const initial = await loadArtistsPosts(slug)

  return <ArtistPage data={initial.data} isDraftMode={false} />
  // return <h1>Slug: {slug}</h1>
}
