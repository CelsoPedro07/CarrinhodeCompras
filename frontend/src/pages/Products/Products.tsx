import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ProductFilters } from '@/pages/Products/ProductFilters'
import { ProductDetailsDialog } from '@/pages/Products/ProductDetailsDialog'
import { ProductTable } from '@/pages/Products/ProductTable'
import { useProducts } from '@/hooks/useProducts'
import { useProductMutations } from '@/hooks/useProductMutations'
import { Product } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

export function Products() {
  const productsQuery = useProducts()
  const products = productsQuery.data ?? []
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const mutations = useProductMutations()

  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')
  const [newRating, setNewRating] = useState('')

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
          <form
            className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault()
              const price = Number(newPrice)
              const stock = Number(newStock)
              const rating = Number(newRating)

              if (!newName.trim() || !newCategory.trim()) {
                return
              }

              mutations.create.mutate({
                name: newName.trim(),
                category: newCategory.trim(),
                price: Number.isNaN(price) ? 0 : price,
                stock: Number.isNaN(stock) ? 0 : stock,
                rating: Number.isNaN(rating) ? 0 : rating,
              })

              setNewName('')
              setNewCategory('')
              setNewPrice('')
              setNewStock('')
              setNewRating('')
            }}
          >
            <input
              className="rounded-lg p-2 border"
              placeholder="Nome"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="rounded-lg p-2 border"
              placeholder="Categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <input
              type="number"
              className="rounded-lg p-2 border"
              placeholder="Preço"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <input
              type="number"
              className="rounded-lg p-2 border"
              placeholder="Estoque"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
            />
            <div className="flex flex-col justify-end">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="number"
                  className="rounded-lg p-2 border"
                  placeholder="Avaliação"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-3 py-2 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!newName.trim() || !newCategory.trim()}
                >
                  Adicionar Produto
                </button>
              </div>
            </div>
          </form>
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
          onDelete={(id) => {
            mutations.remove.mutate(id)
            setDetailsOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
