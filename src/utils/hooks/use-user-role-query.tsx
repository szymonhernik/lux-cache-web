import { useQuery } from '@tanstack/react-query'
import { fetchUserRole } from '../fetch-helpers/client'

export default function useUserRole(expiresAt: number | null) {
  const queryKey = ['userRole', expiresAt]
  const queryFn = fetchUserRole
  return useQuery({ queryKey, queryFn, enabled: expiresAt !== null })
}
