import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createProduct, updateProduct, deleteProduct } from '@/services/api'
import { Product } from '@/types'

export function useProductMutations() {
  const qc = useQueryClient()

  const create = useMutation({
    mutationFn: (payload: Partial<Product>) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries(['products']),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) => updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries(['products']),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries(['products']),
  })

  return { create, update, remove }
}
