'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

import { isAuthenticated } from '../data/auth'

import { checkRateLimit, checkStrictRateLimit } from '../upstash/helpers'
import {
  emailUpdateSchema,
  inviteContributorSchema,
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
import { assignRoleToUser } from '../supabase/admin'

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

// USED FOR EARLY ACCESS

export async function signUpEarlyAccess(
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

  // Dynamically determine the callback URL based on the current domain
  // This allows testing on Vercel preview deployments while maintaining production functionality
  let callbackURL: string

  // Check if we're on the production domain and prioritize it
  const isProduction =
    process.env.NEXT_PUBLIC_SITE_URL === 'https://early.luxcache.com'

  let host: string
  if (isProduction) {
    // Force production domain for early.luxcache.com
    host = 'https://early.luxcache.com'
  } else {
    // Use Vercel's VERCEL_URL for automatic domain detection, fallback to SITE_URL, then localhost
    host =
      process.env.VERCEL_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000'
  }

  const baseUrl = host.startsWith('http') ? host : `https://${host}`
  // Direct redirect to success page instead of going through auth callback
  callbackURL = `${baseUrl}/early-access/success`

  // Debug logging - remove this after testing
  console.log('Environment variables:', {
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    host,
    baseUrl,
    callbackURL
  })

  const { email, password } = result.data

  // Pass is_early_access in the signup metadata.
  // Update your trigger to set is_early_access from the metadata.
  // This avoids RLS issues and race conditions.
  const supabase = createClient()
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
      captchaToken: captchaToken,
      data: { is_early_access: true }
    }
  })

  // Solution: Use the existing admin client
  // Modify your signUpEarlyAccess function to use the admin client
  // Tag as early access if signup succeeded and user exists
  // if (!error && data.user) {
  //   const { error: updateError } = await supabase
  //     .from('users')
  //     .update({ is_early_access: true })
  //     .eq('id', data.user.id)

  //   if (updateError) {
  //     console.error('Failed to update is_early_access:', updateError)
  //   }
  // }

  let redirectPath: string
  if (error) {
    redirectPath = getErrorRedirect(
      '/early-access',
      'Sign up failed.',
      error.message
    )
  } else if (data.session) {
    redirectPath = getStatusRedirect(
      '/early-access',
      'Success!',
      'Welcome to Early Access!'
    )
  } else {
    redirectPath = getStatusRedirect(
      '/early-access',
      'Success!',
      'Check your email to confirm your early access spot!'
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
    redirectPath = getStatusRedirect(
      '/browse',
      'Success!',
      'You are now signed in.'
    )
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

// NOT USED FOR NOW
// ✅ check for authentication
// ✅ add rate limiting to the request
// ✅ add Zod server-side validation
// export async function updateName(formData: FormData) {
//   const fullName = String(formData.get('fullName')).trim()
//   const userId = String(formData.get('userId'))

//   // verify userId is a valid uuid with zod
//   const userIdValidation = z.string().uuid().safeParse(userId)
//   if (!userIdValidation.success) {
//     return getErrorRedirect(
//       '/account',
//       'Invalid input',
//       'User ID is not a valid UUID'
//     )
//   }
//   const result = nameUpdateSchema.safeParse({ fullName })
//   if (!result.success) {
//     return getErrorRedirect(
//       '/account',
//       'Invalid input',
//       result.error.errors[0].message
//     )
//   }
//   // Strict ratelimiter: 5 requests per 60 seconds
//   await checkStrictRateLimit('auth:update_name')

//   if (!(await isAuthenticated())) {
//     throw new Error('Unauthorized')
//   }

//   const supabase = createClient()
//   const { error, data } = await supabase
//     .from('users')
//     .update({ full_name: fullName })
//     .eq('id', userId)
//     .select('full_name')
//     .single()

//   if (error) {
//     return getErrorRedirect(
//       '/account',
//       'Your name could not be updated.',
//       error.message
//     )
//   } else if (data) {
//     return getStatusRedirect(
//       '/account',
//       'Success!',
//       'Your name has been updated.'
//     )
//   } else {
//     return getErrorRedirect(
//       '/account',
//       'Hmm... Something went wrong.',
//       'Your name could not be updated.'
//     )
//   }
// }
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

export async function inviteContributor(formData: FormData) {
  // zod validation
  const result = inviteContributorSchema.safeParse({
    email: String(formData.get('email'))
  })
  if (!result.success) {
    return getErrorRedirect(
      '/admin',
      'Invalid input',
      result.error.errors[0].message
    )
  }
  // Check if the current user is an admin
  const supabase = createClient()
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    throw new Error('Unauthorized')
  }
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.user.id)
    .single()

  if (!roles || roles.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  try {
    // Use the admin client to assign the role
    await assignRoleToUser(result.data.email, 'contributor')

    return getStatusRedirect(
      '/admin',
      'Success!',
      `Contributor role assigned to ${result.data.email}`
    )
  } catch (error) {
    console.error('Failed to assign contributor role:', error)
    return getErrorRedirect(
      '/admin',
      'Operation failed',
      'Failed to assign contributor role. The user might not exist in the system.'
    )
  }
}

// export async function inviteContributor(formData: FormData) {
// check if authenticated
// check if user has user_roles = admin
//   Implement the logic in your application to handle role assignments. This involves:
// Fetching the user ID based on the email provided.
// Inserting a new role for that user in the user_roles table.
// Example SQL for Application Logic
// -- Fetch user ID by email
// SELECT id FROM users WHERE email = 'user@example.com';
// -- Insert contributor role for the user
// INSERT INTO user_roles (user_id, role) VALUES (fetched_user_id, 'contributor');
// }
