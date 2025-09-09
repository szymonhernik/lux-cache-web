'use client'

import { createClient } from '@/utils/supabase/client'
import { type Provider } from '@supabase/supabase-js'
import { getURL } from '@/utils/helpers'
import { redirectToPath } from './server'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement>,
  requestFunc: (formData: FormData) => Promise<string>,
  router: AppRouterInstance | null = null
): Promise<boolean | void> {
  // Prevent default form submission refresh
  e.preventDefault()

  const formData = new FormData(e.currentTarget)
  const redirectUrl: string = await requestFunc(formData)

  if (router) {
    // If client-side router is provided, use it to redirect
    router.refresh()
    return router.push(redirectUrl)
  } else {
    // Otherwise, redirect server-side
    return await redirectToPath(redirectUrl)
  }
}

// export async function handlePaymentMethodChange(data, requestFunc, router) {
//   const { paymentMethodId, subscriptionId, currentPath } = data; // Destruct

//   // console.log('subscriptionId in handlePaymentMethodChange', subscriptionId);

//   // console.log('redirectUrl in handlePaymentMethodChange', redirectUrl);
//   const redirectUrl = await requestFunc(
//     paymentMethodId,
//     subscriptionId,
//     currentPath
//   );

//   if (router) {
//     // return await redirectToPath(redirectUrl);
//     router.push(redirectUrl);
//     router.refresh();
//     // router.refresh();
//     // window.history.pushState(null, '', redirectUrl);
//   } else {
//     // Otherwise, redirect server-side
//     return await redirectToPath(redirectUrl);
//   }
// }

export async function signInWithOAuth(e: React.FormEvent<HTMLFormElement>) {
  // Prevent default form submission refresh
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const provider = String(formData.get('provider')).trim() as Provider

  // Create client-side supabase client and call signInWithOAuth
  const supabase = createClient()
  const redirectURL = getURL('/auth/callback')

  // Add redirect parameter to indicate this is from early access
  const redirectURLWithParams = `${redirectURL}?redirect=/early-access`

  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: redirectURLWithParams
    }
  })
}
