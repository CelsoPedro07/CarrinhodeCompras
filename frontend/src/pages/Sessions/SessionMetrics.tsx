import { Card } from '@/components/ui/card'

interface SessionMetricsProps {
  activeSessions: number
  endedSessions: number
  averageDuration: number
}

export function SessionMetrics({ activeSessions, endedSessions, averageDuration }: SessionMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sessões Ativas</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{activeSessions}</p>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sessões Encerradas</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{endedSessions}</p>
      </Card>
      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tempo Médio</p>
        <p className="text-3xl font-semibold text-slate-950 dark:text-slate-100">{averageDuration.toFixed(1)} min</p>
      </Card>
    </div>
  )
}
