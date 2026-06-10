import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { QueryMetric } from '@/types'

interface QueryPerformanceTableProps {
  metrics: QueryMetric[]
}

export function QueryPerformanceTable({ metrics }: QueryPerformanceTableProps) {
  const columnHelper = createColumnHelper<QueryMetric>()

  const columns = [
    columnHelper.accessor('name', {
      header: 'Query',
    }),
    columnHelper.accessor('collection', {
      header: 'Coleção',
      cell: (info) => info.getValue().toUpperCase(),
    }),
    columnHelper.accessor('executionTime', {
      header: 'Latência (ms)',
    }),
    columnHelper.accessor('docsExamined', {
      header: 'Docs Examined',
    }),
    columnHelper.accessor('baselineDocsExamined', {
      header: 'Docs Antes do índice',
      cell: (info) => {
        const value = info.getValue() as number | null
        return value != null ? value : '-'
      },
    }),
    columnHelper.accessor('keysExamined', {
      header: 'Keys Examined',
    }),
    columnHelper.accessor('baselineExecutionTime', {
      header: 'Antes do índice (ms)',
      cell: (info) => {
        const value = info.getValue() as number | null
        return value != null ? `${value} ms` : '-'
      },
    }),
    columnHelper.accessor('gainPercentage', {
      header: 'Ganho %',
      cell: (info) => {
        const value = info.getValue() as number | null
        return value != null ? `${value}%` : '-'
      },
    }),
    columnHelper.accessor('stage', {
      header: 'Fase do plano',
    }),
    columnHelper.accessor('usedIndex', {
      header: 'Índice Utilizado',
      cell: (info) => (info.getValue() ? 'Sim' : 'Não'),
    }),
    columnHelper.display({
      id: 'status',
      header: 'Classificação',
      cell: ({ row }) => {
        const time = row.original.executionTime
        const badgeClass = time < 60 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' : time < 130 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
        return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{time < 60 ? 'Rápida' : time < 130 ? 'Média' : 'Lenta'}</span>
      },
    }),
  ]

  const table = useReactTable({ data: metrics, columns, getCoreRowModel: getCoreRowModel() })

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
      {metrics.length === 0 ? <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Nenhuma métrica de query disponível.</div> : null}
    </div>
  )
}
