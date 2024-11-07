import EmailForm from '@/components/ui/AccountForms/EmailForm'
import NameForm from '@/components/ui/AccountForms/NameForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import PasswordForm from '@/components/ui/AccountForms/PasswordForm'
import { getUser, getUserDetails } from '@/utils/supabase/queries'

export default async function Account() {
  const supabase = createClient()
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ])

  if (!user) {
    return redirect('/signin/password_signin')
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold ">Account</h1>
      <div className="divide-y flex flex-col gap-8 *:pt-8">
        <NameForm userName={userDetails?.full_name ?? ''} userId={user?.id} />
        <EmailForm userEmail={user.email} />
        <PasswordForm />
      </div>
    </>
  )
}
