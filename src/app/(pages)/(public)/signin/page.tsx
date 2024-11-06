import { redirect } from 'next/navigation'

export default function SignIn() {
  // const preferredSignInView =
  //   cookies().get('preferredSignInView')?.value || null;
  // const defaultView = getDefaultSignInView(preferredSignInView);

  return redirect(`/signin/password_signin`)
}
