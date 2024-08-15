import 'server-only'
import { loadInitalPosts } from '@/sanity/loader/loadQuery'

import BrowsePage from './_components/main/BrowsePage'
import { limitNumber } from '@/utils/fetch-helpers/client'

export default async function Page() {
  const paginationParams = {
    lastPublishedAt: null,
    lastId: null,
    limit: limitNumber
  }
  const initial = await loadInitalPosts(paginationParams)

  return <BrowsePage data={initial.data} isDraftMode={false} />
}
