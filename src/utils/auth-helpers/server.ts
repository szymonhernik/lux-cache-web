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

const emailSchema = z.string().email('Invalid email address')

export async function redirectToPath(path: string) {
  return redirect(path)
}

// USED!
// ✅ check for authentication
export async function SignOut(formData: FormData) {
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
export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies()
  const callbackURL = getURL('/auth/callback')

  let redirectPath: string

  const email = String(formData.get('email')).trim()
  const emailValidation = emailSchema.safeParse(email)
  if (!emailValidation.success) {
    return getErrorRedirect(
      '/signin/email_signin',
      'Invalid email address.',
      'Please try again.'
    )
  }

  const supabase = createClient()
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  }

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes()
  if (allowPassword) options.shouldCreateUser = false
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  })

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'You could not be signed in.',
      error.message
    )
  } else if (data) {
    cookieStore.set('preferredSignInView', 'email_signin', { path: '/' })
    redirectPath = getStatusRedirect(
      '/signin/email_signin',
      'Success!',
      'Please check your email for a magic link. You may now close this tab.',
      true
    )
    revalidatePath('/')
  } else {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Hmm... Something went wrong.',
      'You could not be signed in.'
    )
  }

  return redirectPath
}
// USED!
export async function requestPasswordUpdate(values: { email: string }) {
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
export async function signInWithPassword(values: {
  email: string
  password: string
}) {
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
export async function signUp(values: { email: string; password: string }) {
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
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Sign up failed.',
      'There is already an account associated with this email address. Try resetting your password.'
    )
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Success!',
      'Please check your email for a confirmation link. You may now close this tab.'
    )
  } else {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Hmm... Something went wrong.',
      'You could not be signed up.'
    )
  }

  return redirectPath
}

// USED!
export async function updatePassword(values: { password: string }) {
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
export async function updateEmail(formData: FormData) {
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
export async function updateName(formData: FormData) {
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
export async function updatePasswordInAccountDashboard(formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const password = String(formData.get('password')).trim()
  const passwordConfirm = String(formData.get('passwordConfirm')).trim()
  let redirectPath: string
  // Rate limit the request
  // Read from Vercel headers, specifically the ja4-digest
  // TODO: consider user limiting or IP
  const ja4 = headers().get('x-vercel-ja4-digest')
  const { success } = await ratelimit.limit(ja4 ?? 'anonymous')

  if (!success) {
    redirectPath = getErrorRedirect(
      '/account',
      'For security purposes you can attempt at updating your password three times every 5 minutes.',
      'Please try again later.'
    )
    return redirectPath
  }

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
