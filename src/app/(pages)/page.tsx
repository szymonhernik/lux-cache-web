import HomePage from '@/components/pages/home/HomePage'
import { unstable_noStore } from 'next/cache'

import HomePagePreview from '@/components/pages/home/HomePagePreview'
import { createClient } from '@/utils/supabase/server'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loadPosts } from '@/sanity/loader/loadQuery'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// export default async function Page() {
//   return <p>Homepage</p>
// }
export default async function Page() {
  unstable_noStore()
  // if (draftMode().isEnabled) {
  //   return <HomePagePreview initial={initial} />
  // }

  return <HomePage data={null} />
}
