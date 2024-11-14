'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

import { isAuthenticated } from '../data/auth'
import { z } from 'zod'
import { checkRateLimit, checkStrictRateLimit } from '../upstash/helpers'
import {
  emailUpdateSchema,
  nameUpdateSchema,
  passwordResetSchema,
  PasswordResetSchema,
  passwordUpdateFormSchema,
  passwordUpdateSchema,
  PasswordUpdateSchema,
  signInSchema,
  SignInSchema,
  signUpSchema,
  SignUpSchema
} from '../types/zod/auth'

export async function redirectToPath(path: string) {
  return redirect(path)
}

// USED!
// ✅ check for authentication
// ✅ add rate limiting to the request
// ✅ Zod not needed in SignOut -> not passing any sensitive data
export async function SignOut(pathname: string) {
  let redirectPath: string
  // Default ratelimiter: 10 requests per 60 seconds
  await checkRateLimit('auth:signout')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirectPath = getErrorRedirect(
      pathname,
      'Hmm... Something went wrong.',
      'You could not be signed out.'
    )
    return redirectPath
  }

  redirectPath = getStatusRedirect('/', 'Success', 'You are now signed out.')
  return redirectPath
}

// USED!
// ✅ check for authentication
// ✅ add rate limiting to the request
// ✅ add Zod server-side validation
export async function requestPasswordUpdate(
  values: PasswordResetSchema,
  captchaToken: string | undefined
) {
  const result = passwordResetSchema.safeParse(values)
  if (!result.success) {
    return getErrorRedirect(
      '/signin/forgot_password',
      'Invalid input',
      result.error.errors[0].message
    )
  }

  // Rate limit password reset attempts: allow 5 attempts per minute
  await checkStrictRateLimit('auth:password_reset')

  const callbackURL = getURL('/auth/reset_password')

  let redirectPath: string

  const { email } = result.data

  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
    captchaToken
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      error.message,
      'Please try again.'
    )
    return redirectPath
  }
  // Always return success to prevent email enumeration
  redirectPath = getStatusRedirect(
    '/browse',
    'Success!',
    'If an account exists with this email, you will receive a password reset link.',
    true
  )
  return redirectPath
}

// USED!
// ✅ no authentication = public function
// ✅ add rate limiting to the request
// ✅ add Zod server-side validation
export async function signInWithPassword(
  values: SignInSchema,
  captchaToken: string | undefined
) {
  // Server-side validation
  const result = signInSchema.safeParse(values)
  if (!result.success) {
    return getErrorRedirect(
      '/signin/password_signin',
      'Invalid input',
      result.error.errors[0].message
    )
  }
  // Rate limit login attempts: allow 5 attempts per minute
  await checkStrictRateLimit('auth:signin')

  const { email, password } = result.data // Use validated data
  const cookieStore = cookies()

  let redirectPath: string

  const supabase = createClient()
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken: captchaToken
    }
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
// ✅ no authentication = public function
// ✅ add rate limiting to the request
// ✅ add Zod server-side validation
export async function signUp(
  values: SignUpSchema,
  captchaToken: string | undefined
) {
  // Server-side validation
  const result = signUpSchema.safeParse(values)
  if (!result.success) {
    return getErrorRedirect(
      '/signin/signup',
      'Invalid input',
      result.error.errors[0].message
    )
  }
  // Rate limit signup attempts: allow 5 attempts per minute
  await checkStrictRateLimit('auth:signup')

  const callbackURL = getURL('/auth/callback')

  const { email, password } = result.data // Use validated data
  let redirectPath: string

  const supabase = createClient()
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
      captchaToken: captchaToken
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
// ✅ check for authentication
// ✅ add rate limiting to the request
// ✅ add Zod server-side validation
export async function updatePassword(values: PasswordUpdateSchema) {
  const result = passwordUpdateSchema.safeParse(values)
  if (!result.success) {
    return getErrorRedirect(
      '/signin/update_password',
      'Invalid input',
      result.error.errors[0].message
    )
  }

  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_password')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  let redirectPath: string

  const { password } = result.data

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
// ✅ add Zod server-side validation
export async function updateEmail(values: FormData) {
  const result = emailUpdateSchema.safeParse(values)
  if (!result.success) {
    return getErrorRedirect(
      '/signin/update_email',
      'Invalid input',
      result.error.errors[0].message
    )
  }
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_email')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const { newEmail } = result.data
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
// ✅ add Zod server-side validation
export async function updateName(formData: FormData) {
  const fullName = String(formData.get('fullName')).trim()
  const userId = String(formData.get('userId'))

  // verify userId is a valid uuid with zod
  const userIdValidation = z.string().uuid().safeParse(userId)
  if (!userIdValidation.success) {
    return getErrorRedirect(
      '/account',
      'Invalid input',
      'User ID is not a valid UUID'
    )
  }
  const result = nameUpdateSchema.safeParse({ fullName })
  if (!result.success) {
    return getErrorRedirect(
      '/account',
      'Invalid input',
      result.error.errors[0].message
    )
  }
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_name')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

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
// ✅ add Zod server-side validation
export async function updatePasswordInAccountDashboard(formData: FormData) {
  const password = String(formData.get('password')).trim()
  const confirmPassword = String(formData.get('confirmPassword')).trim()
  const result = passwordUpdateFormSchema.safeParse({
    password,
    confirmPassword
  })
  if (!result.success) {
    return getErrorRedirect(
      '/account',
      'Invalid input',
      result.error.errors[0].message
    )
  }
  // Strict ratelimiter: 5 requests per 60 seconds
  await checkStrictRateLimit('auth:update_password')

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  let redirectPath: string

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
