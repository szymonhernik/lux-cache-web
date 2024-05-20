import HomePage from '@/components/pages/home/HomePage'
import HomePagePreview from '@/components/pages/home/HomePagePreview'
import { createClient } from '@/utils/supabase/server'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loadPosts } from '@/sanity/loader/loadQuery'

export default async function Page() {
  const initial = await loadPosts()

  if (draftMode().isEnabled) {
    return <HomePagePreview initial={initial} />
  }

  return <HomePage data={initial.data} />
}
