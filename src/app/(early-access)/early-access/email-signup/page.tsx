import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings'

import EmailSignupEarlyAccess from './_components/EmailSignupEarlyAccess'
import OAuthSignup from '../_components/OAuthSignup'
import { Suspense } from 'react'

export default function Page() {
  const { allowEmail, allowOauth } = getAuthTypes()
  const redirectMethod = getRedirectMethod()
  return (
    <div className="">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white border border-gray-200">
        <OAuthSignup allowOauth={allowOauth} />

        {allowEmail && (
          <Suspense fallback={<div>Loading...</div>}>
            <EmailSignupEarlyAccess
              allowEmail={true}
              redirectMethod={'client'}
            />
          </Suspense>
        )}
      </div>
    </div>
  )
}
