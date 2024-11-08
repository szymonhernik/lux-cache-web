import { createClient } from '@/utils/supabase/server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import CustomStripeCheckout from './_components/CustomStripeCheckout'
import {
  getPrice,
  getSubscription,
  getUser,
  getCanTrial
} from '@/utils/supabase/queries'

export const dynamic = 'force-dynamic'

const SearchParamsSchema = z
  .object({
    priceId: z.string()
  })
  .strict()

export default async function CheckoutPage({
  params,
  searchParams
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const validatedSearchParams = SearchParamsSchema.safeParse(searchParams)
  if (!validatedSearchParams.success) {
    // if the search params are not valid, redirect to the homepage
    console.error(validatedSearchParams.error.issues)
    redirect('/')
  }

  // check if the user has subscription
  const supabase = createClient()
  const [subscription] = await Promise.all([getSubscription(supabase)])

  if (subscription) {
    return redirect('/account')
  }

  // get price and product info from supabase based on the price id
  const [price, userCanTrial] = await Promise.all([
    getPrice(supabase, searchParams.priceId as string),
    getCanTrial(supabase)
  ])

  // if the price is found and all the checks passed we can render the custom checkout page

  return (
    <div className="max-w-screen-sm mx-auto flex flex-col gap-4 py-36">
      <CustomStripeCheckout price={price} userCanTrial={userCanTrial} />
    </div>
  )
}
