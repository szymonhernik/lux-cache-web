import { loadFilterGroups } from '@/sanity/loader/loadQuery'
import { draftMode } from 'next/headers'
import FilterDialog from './FilterDialog'

export default async function Filter() {
  // freeze for 10 seconds
  const initial = await loadFilterGroups()

  // if (draftMode().isEnabled) {
  //   // return <FiltersPreview initial={initial} />
  //   return null
  // }

  return <FilterDialog data={initial.data} />
}
