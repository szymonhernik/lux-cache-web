import { useQuery } from '@tanstack/react-query'
import { fetchSubscriptions } from '../fetch-helpers/client'

export default function useSubscription(expiresAt: number | null) {
  const queryKey = ['subscription', expiresAt]
  const staleTime = 5 * 60 * 1000
  const queryFn = fetchSubscriptions
  console.log('expiresAt key:', expiresAt)

  return useQuery({ queryKey, staleTime, queryFn, enabled: expiresAt !== null })
}
