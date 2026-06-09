import * as React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string
  description?: string
  icon?: React.ReactNode
}

export function MetricCard({ label, value, description, icon }: MetricCardProps) {
  return (
    <Card className="space-y-3 p-5">
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{value}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </div>
        {icon ? <div className="text-slate-400 dark:text-slate-500">{icon}</div> : null}
      </CardHeader>
      {description ? <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </Card>
  )
}
