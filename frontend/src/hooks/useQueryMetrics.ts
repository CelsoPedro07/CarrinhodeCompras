import { useQuery } from '@tanstack/react-query'
import { getQueries } from '@/services/api'
import { QueryMetric } from '@/types'

export function useQueryMetrics() {
  return useQuery<QueryMetric[]>({
    queryKey: ['queries'],
    queryFn: getQueries,
    staleTime: 1000 * 60 * 5,
  })
}
