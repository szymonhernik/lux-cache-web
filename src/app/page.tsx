import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SplashPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/browse');
  }

  return (
    <div className="">
      <p>Splash page</p>
      <Link href="/pricing" className="">
        Link{' '}
      </Link>
    </div>
  );
}
