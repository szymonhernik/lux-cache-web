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
      <h1 className="text-2xl font-semibold text-center mb-4">
        Get Early Access
      </h1>
      <p className="text-center text-gray-600 mb-8 ">
        For your first six months, you’ll enjoy full Premium access for the
        price of a Regular Subscription.
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
  )
}
