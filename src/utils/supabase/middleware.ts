import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { decodeJwt } from 'jose'
import { type NextRequest, NextResponse } from 'next/server'

// Simple flag to control early access mode
const EARLY_ACCESS_MODE = true // Set to false to disable early access restrictions

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

  // Check if early access mode is enabled and we're on early access domain or localhost
  const isEarlyAccessDomain =
    request.nextUrl.hostname === 'early.luxcache.com' ||
    (EARLY_ACCESS_MODE && request.nextUrl.hostname === 'localhost')

  if (isEarlyAccessDomain) {
    // Only allow access to /test route and api/auth routes
    const allowedPaths = ['/early-access', '/test', '/api/auth']
    const isAllowedPath = allowedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )
    // in local environment redirect to early access page, otherwise redirect to /test for all paths for now

    if (request.nextUrl.hostname === 'localhost') {
      if (!isAllowedPath) {
        // Redirect to /test for any non-allowed paths
        return NextResponse.redirect(new URL('/early-access', request.url))
      }
    } else {
      if (!isAllowedPath || request.nextUrl.pathname === '/early-access') {
        // Redirect to /test for any non-allowed paths
        return NextResponse.redirect(new URL('/test', request.url))
      }
    }

    // For early access domain, just return the response
    return response
  }

  // Normal flow when early access mode is disabled or on other domains
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // People with user account and logged in when visiting homepage see browse page
  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/browse', request.url))
  }

  // Redirect unauthenticated users away from protected routes
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
