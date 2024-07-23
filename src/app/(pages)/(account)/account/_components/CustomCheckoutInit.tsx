// import { createCustomStripeCheckout } from '@/utils/stripe/server'
// import BillingAddress from './BillingAddress'
// import { redirect } from 'next/navigation'
// import { getErrorRedirect } from '@/utils/helpers'

// export default async function CustomCheckoutInit() {
//   let clientSecretReceived: string | null = null
//   const { errorRedirect, sessionId, clientSecret } =
//     await createCustomStripeCheckout('http://localhost:3000/account')
//   if (errorRedirect) {
//     return redirect(errorRedirect)
//   }

//   if (!sessionId && !clientSecret) {
//     return redirect(
//       getErrorRedirect(
//         `/`,
//         'Invalid session',
//         "Sorry, we weren't able to connect to Stripe. Please try again."
//       )
//     )
//   }
//   if (clientSecret) {
//     clientSecretReceived = clientSecret
//   }

//   return (
//     <>
//       {clientSecretReceived && (
//         <BillingAddress clientSecret={clientSecretReceived} />
//       )}
//     </>
//   )
// }
