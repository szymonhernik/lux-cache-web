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
      <div className="w-full max-w-md p-8  bg-white border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-4">
          Get Early Access
        </h1>
        <p className="text-center text-gray-600 mb-8 ">
          Sign up now to secure your spot and receive a 40% discount plus a
          7-day free trial when we launch!
        </p>
        <OAuthSignup allowOauth={allowOauth} disabled={true} />
        <Separator text="or" />
        <Link
          href={`/early-access/email-signup`}
          className="font-light  text-center block"
        >
          Sign up with email to join early access
        </Link>
      </div>
    </div>
  )
}
