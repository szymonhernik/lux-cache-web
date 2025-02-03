import { useQuery } from '@tanstack/react-query'
import { fetchUserRoles } from '../fetch-helpers/client'

export default function useUserRole(expiresAt: number | null) {
  const queryKey = ['userRole', expiresAt]
  const queryFn = fetchUserRoles
  return useQuery({ queryKey, queryFn, enabled: expiresAt !== null })
}
