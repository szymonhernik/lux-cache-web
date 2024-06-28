import { useQuery } from '@tanstack/react-query'
import { createClient } from '../supabase/client'
import { fetchSubscriptions } from '../fetch-helpers/client'

export default function useSubscription(expiresAt: number | null) {
  const supabase = createClient()
  const queryKey = ['subscription', expiresAt]
  const staleTime = 5 * 60 * 1000

  //   const queryFn = async () => {
  //     if (expiresAt !== null && expiresAt !== undefined) {
  //       console.log('expiresAt is not null')
  //       return fetchSubscriptions()
  //     } else {
  //       console.log('expiresAt is null')
  //       return null
  //     }
  //   }
  const queryFn = fetchSubscriptions

  return useQuery({ queryKey, staleTime, queryFn, enabled: expiresAt !== null })
}
