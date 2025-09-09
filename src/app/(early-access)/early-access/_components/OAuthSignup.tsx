import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn'
import Separator from '@/components/ui/AuthForms/Separator'

export default function OAuthSignup({
  allowOauth,
  disabled,
  isEarlyAccess = false
}: {
  allowOauth: boolean
  disabled?: boolean
  isEarlyAccess?: boolean
}) {
  return (
    <>
      {allowOauth && (
        <>
          <OauthSignIn disabled={false} isEarlyAccess={isEarlyAccess} />
        </>
      )}
    </>
  )
}
