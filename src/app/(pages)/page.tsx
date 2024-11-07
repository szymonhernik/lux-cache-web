import HomePage from '@/components/pages/home/HomePage'
import { unstable_noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  unstable_noStore()
  // if (draftMode().isEnabled) {
  //   return <HomePagePreview initial={initial} />
  // }

  return <HomePage data={null} />
}
