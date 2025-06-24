import SignUp from '@/components/ui/AuthForms/Signup'
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn'
import Separator from '@/components/ui/AuthForms/Separator'
import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings'
import Link from 'next/link'

import OAuthSignup from './_components/OAuthSignup'

export default function Page() {
  const { allowOauth } = getAuthTypes()
  const redirectMethod = getRedirectMethod()
  return (
    <div className="">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white border border-gray-200">
        <OAuthSignup allowOauth={allowOauth} />
        <Link
          href={`/early-access/email-signup`}
          className="font-light text-sm text-center block"
        >
          Sign up with email to join early access
        </Link>
      </div>
    </div>
  )
}
