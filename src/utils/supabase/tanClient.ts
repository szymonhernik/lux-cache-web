import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

import { Database, Tables } from 'types_db'

let client: SupabaseClient<Database> | undefined

export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }
  client = createBrowserClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

  return client
}
