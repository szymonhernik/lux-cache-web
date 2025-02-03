import { getUser, getUserRoles } from '@/utils/supabase/queries'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ContributorsInviteForm from './_components/ContributorsInviteForm'

export default async function AdminLayout() {
  const supabase = createClient()
  const [user, userRole] = await Promise.all([
    getUser(supabase),
    getUserRoles(supabase)
  ])

  if (!user || !userRole.includes('admin')) {
    return redirect('/about')
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold ">Admin</h1>
      <div className="divide-y flex flex-col gap-8 *:pt-8">
        <ContributorsInviteForm />
      </div>
    </>
  )
}
