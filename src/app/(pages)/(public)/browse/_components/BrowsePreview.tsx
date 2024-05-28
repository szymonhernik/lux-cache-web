import { loadPosts } from '@/sanity/loader/loadQuery'
import DraftModeGrid from './DraftModeGrid'

export default async function BrowsePreview() {
  const previewData = await loadPosts()
  return <DraftModeGrid data={previewData.data} />
}
