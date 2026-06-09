import { ReactNode } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardChartProps {
  title: string
  children: ReactNode
}

export function DashboardChart({ title, children }: DashboardChartProps) {
  return (
    <Card className="p-4 lg:p-5">
      <CardHeader className="mb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="min-h-[280px] px-1">{children}</div>
    </Card>
  )
}
