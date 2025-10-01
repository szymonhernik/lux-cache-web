import Stripe from 'stripe'
import { redirect } from 'next/navigation'

import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { session_id } = await searchParams
  const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
    {
      apiVersion: '2023-10-16'
    }
  )

  if (session_id) {
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string
    )
    if (session.status === 'complete') {
      const redirectPath = getStatusRedirect(
        `/account/subscription`,
        'Success!',
        'Your subscription is now active.'
      )
      redirect(redirectPath)
    } else {
      const redirectPath = getErrorRedirect(
        `/pricing`,
        'Error!',
        'Something went wrong. Please try again.'
      )
      redirect(redirectPath)
    }
  }
  return null
}
