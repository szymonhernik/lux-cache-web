'use server';

import { createClient } from '@/utils/supabase/server';
import Navbar from './Navbar';

export default async function GlobalNav() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return <Navbar user={user} />;
}
