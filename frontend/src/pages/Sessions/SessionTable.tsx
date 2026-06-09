import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Session, User } from '@/types'

interface SessionTableProps {
  sessions: Session[]
  users: User[]
}

export function SessionTable({ sessions, users }: SessionTableProps) {
  const columnHelper = createColumnHelper<Session>()

  const columns = [
    columnHelper.display({
      id: 'user',
      header: 'Usuário',
      cell: (info) => users.find((user) => user.userId === info.row.original.userId || user._id === info.row.original.userId)?.name ?? 'Desconhecido',
    }),
    columnHelper.accessor('createdAt', {
      header: 'Login',
      cell: (info) => new Date(info.getValue()).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
    }),
    columnHelper.accessor('expiresAt', {
      header: 'Logout',
      cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'Em andamento'),
    }),
    columnHelper.display({
      id: 'duration',
      header: 'Duração',
      cell: ({ row }) => {
        const start = new Date(row.original.createdAt)
        const end = row.original.expiresAt ? new Date(row.original.expiresAt) : new Date()
        const diff = Math.max(0, (end.getTime() - start.getTime()) / 60000)
        return `${diff.toFixed(0)} min`
      },
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.status === 'active'
        return (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
            {isActive ? 'Ativa' : 'Encerrada'}
          </span>
        )
      },
    }),
  ]

  const table = useReactTable({ data: sessions, columns, getCoreRowModel: getCoreRowModel() })

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
      {sessions.length === 0 ? <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Nenhuma sessão disponível.</div> : null}
    </div>
  )
}
