import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings'

import EmailSignupEarlyAccess from './_components/EmailSignupEarlyAccess'
import OAuthSignup from '../_components/OAuthSignup'
import { Suspense } from 'react'
import Separator from '@/components/ui/AuthForms/Separator'

export default function Page() {
  const { allowEmail, allowOauth } = getAuthTypes()
  const redirectMethod = getRedirectMethod()
  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Get Early Access
      </h1>
      <p className="text-center text-gray-600 mb-8 ">
        Sign up now to secure your spot and receive a 40% discount plus a 7-day
        free trial when we launch!
      </p>
      <OAuthSignup allowOauth={allowOauth} disabled={true} />
      <Separator text="or" />

      {allowEmail && (
        <Suspense fallback={<div>Loading...</div>}>
          <EmailSignupEarlyAccess allowEmail={true} redirectMethod={'client'} />
        </Suspense>
      )}
    </div>
  )
}
