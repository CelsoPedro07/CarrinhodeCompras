import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/services/api'
import { User } from '@/types'

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  })
}
