import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') // Get redirect parameter

  if (code) {
    const supabase = createClient()

    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Determine error redirect path based on the redirect parameter
      const errorRedirectPath =
        redirect === '/early-access'
          ? '/early-access'
          : '/signin/password_signin'

      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}${errorRedirectPath}`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      )
    }

    // Handle early access OAuth flow
    if (redirect === '/early-access') {
      // The user is now authenticated and the database trigger has created their user record
      // Now we sign them out immediately and show success message
      await supabase.auth.signOut()

      const redirectPath = getStatusRedirect(
        '/early-access/success',
        'Success!',
        'You are now on the early access list! (with OAuth)'
      )

      return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
    }
  }

  // Determine the redirect path for regular OAuth flows
  let redirectPath = '/account' // Default redirect

  // If redirect parameter is provided and it's a safe path, use it
  if (
    redirect &&
    (redirect.startsWith('/early-access') || redirect.startsWith('/account'))
  ) {
    redirectPath = redirect
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}${redirectPath}`,
      'Success!',
      'You are now signed in. (with email)'
    )
  )
}
