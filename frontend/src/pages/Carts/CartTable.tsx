import { useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Cart, User } from '@/types'
import { Button } from '@/components/ui/button'

interface CartTableProps {
  carts: Cart[]
  users: User[]
}

export function CartTable({ carts, users }: CartTableProps) {
  const columnHelper = createColumnHelper<Cart>()

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'user',
        header: 'Usuário',
        cell: (info) => {
          const userId = info.row.original.userId
          const user = users.find((u) => u.userId === userId || u._id === userId)
          return user?.name ?? 'Desconhecido'
        },
      }),
      columnHelper.display({
        id: 'items',
        header: 'Itens',
        cell: (info) => info.row.original.items?.length ?? 0,
      }),
      columnHelper.accessor('totalAmount', {
        header: 'Valor Total',
        cell: (info) => `R$ ${(info.getValue() ?? 0).toFixed(2)}`,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue()
          const variant = status === 'abandoned' ? 'danger' : 'warning'
          return (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                variant === 'danger'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200'
              }`}
            >
              {status}
            </span>
          )
        },
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Última Atualização',
        cell: (info) =>
          new Date(info.getValue()).toLocaleString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
          }),
      }),
      columnHelper.display({
        id: 'action',
        header: 'Ações',
        cell: () => <Button size="sm" variant="outline">Detalhes</Button>,
      }),
    ],
    [columnHelper, users]
  )

  const table = useReactTable({ data: carts, columns, getCoreRowModel: getCoreRowModel() })

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
      {carts.length === 0 ? <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Nenhum carrinho encontrado.</div> : null}
    </div>
  )
}
