'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers'
import { getAuthTypes } from '@/utils/auth-helpers/settings'
import { revalidatePath } from 'next/cache'
import { ratelimit } from '../upstash/ratelimit'
import { isAuthenticated } from '../data/auth'
import { z } from 'zod'
import { getUser } from '../supabase/queries'
import { checkRateLimit, checkStrictRateLimit } from '../upstash/helpers'

const emailSchema = z.string().email('Invalid email address')

export async function redirectToPath(path: string) {
  return redirect(path)
}

// USED!
// ✅ check for authentication
export async function SignOut(formData: FormData) {
  // Default ratelimiter: 10 requests per 60 seconds
  await checkRateLimit('auth:signout')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const pathName = String(formData.get('pathName')).trim()

  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return getErrorRedirect(
      pathName,
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    )
  } else {
    revalidatePath('/')
    return getStatusRedirect('/', 'Success', 'You are now signed out.')
  }
}

// USED!
// ✅ add rate limiting to the request
export async function requestPasswordUpdate(values: { email: string }) {
  // Rate limit password reset attempts: allow 5 attempts per minute
  await checkStrictRateLimit('auth:password_reset')

  const callbackURL = getURL('/auth/reset_password')

  // Get form data
  let redirectPath: string

  const email = String(values.email).trim()
  const emailValidation = emailSchema.safeParse(email)
  if (!emailValidation.success) {
    return getErrorRedirect(
      '/signin/forgot_password',
      'Invalid email address.',
      'Please try again.'
    )
  }

  const supabase = createClient()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      error.message,
      'Please try again.'
    )
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/browse',
      'Success!',
      'Please check your email for a password reset link. You may now close this tab.',
      true
    )
  } else {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Hmm... Something went wrong.',
      'Password reset email could not be sent.'
    )
  }

  return redirectPath
}

// USED!
// ✅ add rate limiting to the request
export async function signInWithPassword(values: {
  email: string
  password: string
}) {
  // Rate limit login attempts: allow 5 attempts per minute
  await checkStrictRateLimit('auth:signin')

  const cookieStore = cookies()
  const email = String(values.email).trim()
  const password = String(values.password).trim()
  let redirectPath: string

  const supabase = createClient()
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Sign in failed.',
      error.message
    )
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' })

    redirectPath = getStatusRedirect(
      '/redirect?url=/browse',
      'Success!',
      'You are now signed in.'
    )
  } else {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    )
  }

  return redirectPath
}

// USED!
// ✅ add rate limiting to the request
export async function signUp(values: { email: string; password: string }) {
  // Rate limit signup attempts: allow 5 attempts per minute
  await checkStrictRateLimit('auth:signup')

  const callbackURL = getURL('/auth/callback')

  const password = String(values.password).trim()
  let redirectPath: string

  const email = String(values.email).trim()
  const emailValidation = emailSchema.safeParse(email)
  if (!emailValidation.success) {
    return getErrorRedirect(
      '/signin/forgot_password',
      'Invalid email address.',
      'Please try again.'
    )
  }

  const supabase = createClient()
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL
    }
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Sign up failed.',
      error.message
    )
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.')
  } else {
    // MORE PRIVACY-FOCUSED APPROACH
    // Always show the "check your email" message, regardless of whether
    // this is a new signup or an existing user
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Please check your email for a confirmation link. You may now close this tab.'
    )
  }

  return redirectPath
}

// USED!
// ✅ add rate limiting to the request
export async function updatePassword(values: { password: string }) {
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_password')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const password = String(values.password).trim()
  let redirectPath: string

  const supabase = createClient()
  const { error, data } = await supabase.auth.updateUser({
    password
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Your password could not be updated.',
      error.message
    )
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/browse',
      'Success!',
      'Your password has been updated.'
    )
  } else {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    )
  }

  return redirectPath
}

// USED!
// ✅ check for authentication
// ✅ add rate limiting to the request
export async function updateEmail(formData: FormData) {
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_email')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const newEmail = String(formData.get('newEmail')).trim()

  const emailValidation = emailSchema.safeParse(newEmail)
  if (!emailValidation.success) {
    return getErrorRedirect(
      '/signin/forgot_password',
      'Invalid email address.',
      'Please try again.'
    )
  }

  const supabase = createClient()
  const callbackUrl = getURL(
    getStatusRedirect('/account', 'Success!', `Your email has been updated.`)
  )

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  )

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your email could not be updated.',
      error.message
    )
  } else {
    return getStatusRedirect(
      '/account',
      'Confirmation emails sent.',
      `You will need to confirm the update by clicking the links sent to both the old and new email addresses.`
    )
  }
}

// USED!
// ✅ check for authentication
// ✅ add rate limiting to the request
export async function updateName(formData: FormData) {
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_name')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const fullName = String(formData.get('fullName')).trim()
  const userId = String(formData.get('userId'))

  const supabase = createClient()
  const { error, data } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', userId)
    .select('full_name')
    .single()

  if (error) {
    return getErrorRedirect(
      '/account',
      'Your name could not be updated.',
      error.message
    )
  } else if (data) {
    return getStatusRedirect(
      '/account',
      'Success!',
      'Your name has been updated.'
    )
  } else {
    return getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'Your name could not be updated.'
    )
  }
}
// USED!
// ✅ check for authentication
// ✅ add rate limiting to the request
export async function updatePasswordInAccountDashboard(formData: FormData) {
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_password')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const password = String(formData.get('password')).trim()
  const passwordConfirm = String(formData.get('passwordConfirm')).trim()
  let redirectPath: string

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/account',
      'Your password could not be updated.',
      'Passwords do not match.'
    )
    return redirectPath
  }

  const supabase = createClient()
  const { error, data } = await supabase.auth.updateUser({
    password
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/account',
      'Your password could not be updated.',
      error.message
    )
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/account',
      'Success!',
      'Your password has been updated.'
    )
  } else {
    redirectPath = getErrorRedirect(
      '/account',
      'Hmm... Something went wrong.',
      'Your password could not be updated.'
    )
  }

  return redirectPath
}
