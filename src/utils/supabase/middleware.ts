import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        }
      } as CookieMethodsServer
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
      const userRoles = (decodedJwt.user_roles as string[]) || []
      // console.log('userRoles:', userRoles)
      // userRoles: [ 'admin', 'contributor' ]
      // if someone is trying to access admin page without being admin, redirect to about page
      if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !userRoles.includes('admin')
      ) {
        return NextResponse.redirect(new URL('/about', request.url))
      }

      // response.headers.set('x-user-role', userRole as string)
      response.headers.set('x-user-roles', userRoles.join(',') as string)
    }
  } catch (e) {
    console.error('JWT Error:', e)
  }
  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  return response
}
