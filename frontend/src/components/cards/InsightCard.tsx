import * as React from 'react'
import { Card } from '@/components/ui/card'

interface InsightCardProps {
  title: string
  value: string
  description: string
  badge?: string
}

export function InsightCard({ title, value, description, badge }: InsightCardProps) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Insight</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
        </div>
        {badge ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900 dark:text-sky-200">{badge}</span>
        ) : null}
      </div>
      <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
    </Card>
  )
}
