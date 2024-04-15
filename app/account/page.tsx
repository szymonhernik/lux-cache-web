import BillingInfo from '@/components/ui/AccountForms/BillingInfo';
import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import BillingInfoSupabase from '@/components/ui/AccountForms/BillingInfoSupabase';
import { Suspense } from 'react';
import BillingInfoScheleton from '@/components/ui/AccountForms/BillingInfoScheleton';
import BillingInfoFetchZod from '@/components/ui/AccountForms/BillingInfoFetchZod';

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect('/signin');
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        {/* <CustomerPortalForm subscription={subscription} /> */}
        <Suspense fallback={<BillingInfoScheleton />}>
          <BillingInfoFetchZod subscription={subscription} />
        </Suspense>
        {/* <BillingInfoSupabase
          userDefaultPaymentMethod={userDetails?.payment_method}
        /> */}
        <NameForm userName={userDetails?.full_name ?? ''} userId={user?.id} />
        <EmailForm userEmail={user.email} />
      </div>
    </section>
  );
}
