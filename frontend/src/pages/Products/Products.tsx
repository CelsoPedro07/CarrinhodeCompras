import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ProductFilters } from '@/pages/Products/ProductFilters'
import { ProductDetailsDialog } from '@/pages/Products/ProductDetailsDialog'
import { ProductTable } from '@/pages/Products/ProductTable'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

export function Products() {
  const productsQuery = useProducts()
  const products = productsQuery.data ?? []
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase().trim()
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch) || product.category.toLowerCase().includes(normalizedSearch)
      const matchesCategory = category ? product.category === category : true
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, category])

  return (
    <div className="space-y-6">
      <SectionHeader title="Produtos" description="Gerencie o catálogo de produtos e filtre por categoria, estoque e avaliações." />

      <Card>
        <div className="space-y-6">
          <ProductFilters
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            categoryValue={category}
            onCategoryChange={setCategory}
            categories={categories}
          />
          {productsQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-3xl" />
              ))}
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              onSelectProduct={(product) => {
                setSelectedProduct(product)
                setDetailsOpen(true)
              }}
            />
          )}
        </div>
      </Card>

      {selectedProduct ? (
        <ProductDetailsDialog
          product={selectedProduct}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </div>
  )
}
