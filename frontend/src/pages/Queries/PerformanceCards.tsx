import { Card } from '@/components/ui/card'
import { QueryMetric } from '@/types'

interface PerformanceCardsProps {
  metrics: QueryMetric[]
}

export function PerformanceCards({ metrics }: PerformanceCardsProps) {
  const average = metrics.length ? metrics.reduce((sum, metric) => sum + metric.executionTime, 0) / metrics.length : 0
  const minimum = metrics.length ? Math.min(...metrics.map((metric) => metric.executionTime)) : 0
  const maximum = metrics.length ? Math.max(...metrics.map((metric) => metric.executionTime)) : 0
  const averageGain = metrics.length
    ? metrics.reduce((sum, metric) => sum + (metric.gainPercentage ?? 0), 0) / metrics.length
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tempo Médio</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{average.toFixed(0)} ms</p>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tempo Mínimo</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{minimum.toFixed(0)} ms</p>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tempo Máximo</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{maximum.toFixed(0)} ms</p>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ganho Médio</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{averageGain.toFixed(0)}%</p>
      </Card>
    </div>
  )
}
