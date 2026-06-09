import { useQuery } from '@tanstack/react-query'
import { getCarts } from '@/services/api'
import { Cart } from '@/types'

export function useCarts() {
  return useQuery<Cart[]>({
    queryKey: ['carts'],
    queryFn: getCarts,
    staleTime: 1000 * 60 * 5,
  })
}
