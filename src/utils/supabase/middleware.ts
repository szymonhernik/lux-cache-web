import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { decodeJwt } from 'jose'
import { type NextRequest, NextResponse } from 'next/server'

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: '',
            ...options
          })
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          })
          response.cookies.set({
            name,
            value: '',
            ...options
          })
        }
      }
    }
  )

  return { supabase, response }
}

export const updateSession = async (request: NextRequest) => {
  const { supabase, response } = createClient(request)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  // People with user account and logged in when visiting luxcache.com see browse page on homepage
  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/browse', request.url))
  }

  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/account') ||
      request.nextUrl.pathname.startsWith('/checkout') ||
      request.nextUrl.pathname.startsWith('/bookmarks'))
  ) {
    return NextResponse.redirect(
      new URL('/signin/password_signin', request.url)
    )
  }

  try {
    const session = await supabase.auth.getSession()
    if (session.data.session) {
      const decodedJwt = decodeJwt(session.data.session.access_token)
      const userRole = decodedJwt.user_role
      // console.log('User Role:', userRole)
    }
  } catch (e) {
    console.log(e)
  }
  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  return response
}
