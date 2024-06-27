import { useMemo } from 'react'
import { getSupabaseBrowserClient } from '../supabase/tanClient'

function useSupabase() {
  return useMemo(getSupabaseBrowserClient, [])
}

export default useSupabase
