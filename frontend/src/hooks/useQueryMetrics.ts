import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getQueries } from '@/services/api'
import { QueryMetric } from '@/types'
import { io } from 'socket.io-client'

export function useQueryMetrics(collection?: string) {
  const queryClient = useQueryClient()
  const queryKey = collection ? ['queries', collection] : ['queries', 'all']

  const query = useQuery<QueryMetric[]>({
    queryKey,
    queryFn: () => getQueries(collection),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api').replace(/\/api\/?$/, '')
    const socket = io(apiBase)

    socket.on('connect', () => {
      console.log('Socket connected for query metrics')
    })

    socket.on('query:performance', (payload) => {
      const data = payload?.data ?? payload
      if (!Array.isArray(data)) return

      const filteredData = collection ? data.filter((item: QueryMetric) => item.collection === collection) : data
      queryClient.setQueryData(queryKey, filteredData)
    })

    return () => {
      socket.disconnect()
    }
  }, [collection, queryClient, queryKey])

  return query
}
