import { useQuery } from '@tanstack/react-query'
import { getSessions } from '@/services/api'
import { Session } from '@/types'

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: getSessions,
    staleTime: 1000 * 60 * 5,
  })
}
