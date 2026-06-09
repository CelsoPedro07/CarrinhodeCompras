import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PerformanceCards } from '@/pages/Queries/PerformanceCards'
import { PerformanceCharts } from '@/pages/Queries/PerformanceCharts'
import { QueryPerformanceTable } from '@/pages/Queries/QueryPerformanceTable'
import { useQueryMetrics } from '@/hooks/useQueryMetrics'
import { Skeleton } from '@/components/ui/skeleton'

export function Queries() {
  const queryMetricsQuery = useQueryMetrics()
  const metrics = queryMetricsQuery.data ?? []

  const totalQueries = useMemo(() => metrics.length, [metrics])
  const optimizedQueries = useMemo(() => metrics.filter((item) => item.usedIndex).length, [metrics])

  return (
    <div className="space-y-6">
      <SectionHeader title="Performance" description="Analise o desempenho das consultas MongoDB e identifique impactos de índices." />

      {queryMetricsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-3xl" />
          ))}
        </div>
      ) : (
        <PerformanceCards metrics={metrics} />
      )}

      {queryMetricsQuery.isLoading ? (
        <Skeleton className="h-[520px] rounded-3xl" />
      ) : (
        <PerformanceCharts metrics={metrics} />
      )}

      <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">Contexto</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-100">Consultas e Objetivos</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="font-semibold">Total de queries</p>
              <p className="mt-2 text-3xl font-semibold">{totalQueries}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p className="font-semibold">Consultas otimizadas</p>
              <p className="mt-2 text-3xl font-semibold">{optimizedQueries}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">Cada consulta foi definida para mostrar um aspecto do modelo NoSQL: desempenho de agregações, impacto de índices e comportamento de leitura.</p>
      </Card>

      {queryMetricsQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-[260px] rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.id} className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">{metric.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metric.objective}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${metric.usedIndex ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'}`}>
                  {metric.usedIndex ? 'Índice usado' : 'Sem índice'}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <p className="font-semibold">Latência</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.executionTime} ms</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <p className="font-semibold">Docs analisados</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.docsExamined}</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <p className="font-semibold">Chaves examinadas</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.keysExamined}</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl bg-slate-950 p-4 text-sm text-slate-100 dark:bg-slate-900">
                <p className="font-semibold">Pipeline / Query</p>
                <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-300">{metric.query}</pre>
              </div>
              {metric.indexName ? (
                <div className="flex items-center justify-between rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <span>Índice recomendado</span>
                  <span className="font-semibold">{metric.indexName}</span>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <div>
        <div className="mb-4 text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Métricas</div>
        {queryMetricsQuery.isLoading ? (
          <Skeleton className="h-[420px] rounded-3xl" />
        ) : (
          <QueryPerformanceTable metrics={metrics} />
        )}
      </div>

      {!queryMetricsQuery.isLoading && metrics.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Amostra: {metric.name}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Campos analisados: {metric.resultFields?.join(', ')}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">{metric.resultSample?.length ?? 0} registros</span>
              </div>
              {metric.resultSample && metric.resultSample.length > 0 ? (
                <div className="overflow-x-auto rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
                    <thead>
                      <tr>
                        {metric.resultFields?.map((field) => (
                          <th key={field} className="px-3 py-2 font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metric.resultSample.slice(0, 3).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-slate-200 dark:border-slate-800">
                          {metric.resultFields?.map((field) => (
                            <td key={field} className="px-3 py-2 align-top">
                              {String((row as any)[field] ?? '-')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">Nenhuma amostra disponível.</div>
              )}
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
