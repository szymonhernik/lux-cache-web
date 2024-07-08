import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { ModalLogin } from '../../../_components/modalLogin'
import {
  getAuthTypes,
  getRedirectMethod,
  getViewTypes
} from '@/utils/auth-helpers/settings'
import { redirect } from 'next/navigation'
import Card from '@/components/ui/Card'
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn'
import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn'
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword'
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword'
import SignUp from '@/components/ui/AuthForms/Signup'
import Separator from '@/components/ui/AuthForms/Separator'
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn'

export default async function LoginModal({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { disable_button: boolean }
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes()
  const viewTypes = getViewTypes()
  const redirectMethod = getRedirectMethod()

  let viewProp: string

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id
  } else {
    return redirect(`/signin/password_signin`)
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }

  return (
    <Suspense>
      <ModalLogin>
        <div className="flex justify-center p-4  bg-white pb-24">
          <div className="flex flex-col justify-between max-w-96 w-[90vw] p-3 m-auto  ">
            {/* <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div> */}
            <Card
              title={
                viewProp === 'forgot_password'
                  ? 'Reset Password'
                  : viewProp === 'update_password'
                    ? 'Update Password'
                    : viewProp === 'signup'
                      ? 'Sign Up'
                      : 'Log in'
              }
            >
              {viewProp === 'password_signin' && (
                <PasswordSignIn
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                />
              )}
              {viewProp === 'email_signin' && (
                <EmailSignIn
                  allowPassword={allowPassword}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button}
                />
              )}
              {viewProp === 'forgot_password' && (
                <ForgotPassword
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button}
                />
              )}
              {viewProp === 'update_password' && (
                <UpdatePassword redirectMethod={redirectMethod} />
              )}
              {viewProp === 'signup' && (
                <SignUp
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                />
              )}
              {viewProp !== 'update_password' && allowOauth && (
                <>
                  <Separator text="Or continue with" />
                  <OauthSignIn />
                </>
              )}
            </Card>
          </div>
        </div>
      </ModalLogin>
    </Suspense>
  )
}
