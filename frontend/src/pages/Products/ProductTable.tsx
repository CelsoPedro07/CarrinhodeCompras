import { useMemo } from 'react'
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProductTableProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export function ProductTable({ products, onSelectProduct }: ProductTableProps) {
  const columnHelper = createColumnHelper<Product>()

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Produto',
      }),
      columnHelper.accessor('category', {
        header: 'Categoria',
      }),
      columnHelper.accessor('price', {
        header: 'Preço',
        cell: (info) => `R$ ${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor('stock', {
        header: 'Estoque',
      }),
      columnHelper.accessor('rating', {
        header: 'Avaliação',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => (
          <Button size="sm" variant="outline" onClick={() => onSelectProduct(row.original)}>
            Ver detalhes
          </Button>
        ),
      }),
    ],
    [columnHelper, onSelectProduct]
  )

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-4 font-semibold">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-900/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 align-top text-slate-700 dark:text-slate-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Nenhum produto encontrado.</div>
      ) : null}
    </div>
  )
}
