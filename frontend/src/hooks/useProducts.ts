import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/services/api'
import { Product } from '@/types'

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
  })
}
