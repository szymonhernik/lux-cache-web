import SignUp from '@/components/ui/AuthForms/Signup'
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn'
import Separator from '@/components/ui/AuthForms/Separator'
import { getAuthTypes, getRedirectMethod } from '@/utils/auth-helpers/settings'
import Link from 'next/link'
import EmailSignUp from './EmailSignUp'

export default function EarlyAccessPage() {
  const { allowEmail, allowOauth } = getAuthTypes()
  const redirectMethod = getRedirectMethod()
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-4">
          Get Early Access
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign up now to secure your spot and receive a 40% discount plus a
          7-day free trial when we launch!
        </p>
        {allowOauth && (
          <>
            <OauthSignIn />
            <Separator text="or" />
          </>
        )}
        {/* if email  */}
        {allowEmail && <EmailSignUp />}

        {/* <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} /> */}
      </div>
    </div>
  )
}
