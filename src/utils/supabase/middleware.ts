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

  // Attempt to retrieve and decode the JWT from cookies

  return { supabase, response }
}

export const updateSession = async (request: NextRequest) => {
  const { supabase, response } = createClient(request)
  try {
    const session = await supabase.auth.getSession()
    if (session.data.session) {
      const decodedJwt = decodeJwt(session.data.session.access_token)
      const userRole = decodedJwt.user_role

      // console.log('Decoded JWT:', decodedJwt)
      console.log('User Role:', userRole)
    }
  } catch (e) {
    console.log(e)
  }
  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  return response
}
