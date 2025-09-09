import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn'
import Separator from '@/components/ui/AuthForms/Separator'

export default function OAuthSignup({
  allowOauth,
  disabled
}: {
  allowOauth: boolean
  disabled?: boolean
}) {
  return (
    <>
      {allowOauth && (
        <>
          <OauthSignIn disabled={false} isEarlyAccess={true} />
        </>
      )}
    </>
  )
}
