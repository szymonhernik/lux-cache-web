import Button from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import CustomStripeCheckout from './_components/CustomStripeCheckout';

export const dynamic = 'force-dynamic';

const SearchParamsSchema = z
  .object({
    priceId: z.string()
  })
  .strict();

export default async function CheckoutPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // validate searchParams with Zod

  const validatedSearchParams = SearchParamsSchema.safeParse(searchParams);
  if (!validatedSearchParams.success) {
    // if the search params are not valid, redirect to the homepage
    console.error(validatedSearchParams.error.issues);
    redirect('/');
  }

  // check if the user is logged in

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  // check if the user has a subscription
  // // if yes we want to redirect the user to their account page to avoid making multiple subscriptions

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  if (subscription) {
    redirect('/account');
  }

  // get price and product info from stripe based on the price id
  const { data: price, error: priceFetchError } = await supabase
    .from('prices')
    .select('*, products(*)')
    .eq('active', true)
    .eq('id', validatedSearchParams.data.priceId)
    .eq('products.active', true)
    .maybeSingle();

  if (priceFetchError) {
    return redirect('/');
  }

  const { data: userDetails } = await supabase
    .from('users')
    .select('can_trial')
    .single();

  // console.log('userCanTrial', userCanTrial);

  // if the price is found and all the checks passed we can render the custom checkout page

  return (
    <div className="max-w-screen-sm mx-auto flex flex-col gap-4 py-36">
      <CustomStripeCheckout price={price} userDetails={userDetails} />
      {/* <div className=" border-white-2 border p-4">
        <h1 className="text-xl font-semibold">Checkout</h1>
        {price?.products?.name && <h2>{price.products.name}</h2>}
        {price?.interval && <h2>Interval: {price.interval}</h2>}
      </div> */}
      <Button variant="slim" className="font-semibold  w-fit">
        <Link href="/">Cancel</Link>
      </Button>
    </div>
  );
}
