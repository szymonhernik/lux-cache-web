import { cache } from 'react'
import 'server-only'
import { createClient } from '@/utils/supabase/server'

export const isAuthenticated = cache(async () => {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  return !!user
})
