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

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin/password_signin`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      )
    }
  }

  // Determine the redirect path
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
      'You are now signed in.'
    )
  )
}
