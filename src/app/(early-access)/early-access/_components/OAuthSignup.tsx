import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn'
import Separator from '@/components/ui/AuthForms/Separator'

export default function OAuthSignup({ allowOauth }: { allowOauth: boolean }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Get Early Access</h1>
      <p className="text-center text-gray-600 mb-8">
        Sign up now to secure your spot and receive a 40% discount plus a 7-day
        free trial when we launch!
      </p>
      {allowOauth && (
        <>
          <OauthSignIn />
          <Separator text="or" />
        </>
      )}
    </>
  )
}
