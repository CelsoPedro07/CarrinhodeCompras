import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { QueryMetric } from '@/types'

interface PerformanceChartsProps {
  metrics: QueryMetric[]
}

export function PerformanceCharts({ metrics }: PerformanceChartsProps) {
  const showBaseline = metrics.some((metric) => metric.baselineExecutionTime != null)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <DashboardChart title="Latência por Query">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value, name) => [`${value} ms`, name === 'baselineExecutionTime' ? 'Antes do índice' : 'Depois do índice']} />
            {showBaseline && <Area type="monotone" dataKey="baselineExecutionTime" stroke="#f97316" fill="#fed7aa" strokeWidth={2} />}
            <Area type="monotone" dataKey="executionTime" stroke="#0ea5e9" fill="#bfdbfe" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardChart>

      <DashboardChart title="Comparação Antes/Depois do Índice">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={metrics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value, name) => [`${value} ms`, name === 'baselineExecutionTime' ? 'Antes do índice' : 'Depois do índice']} />
            <Legend wrapperStyle={{ color: '#64748b' }} />
            {showBaseline && <Bar dataKey="baselineExecutionTime" name="Antes do índice" fill="#f97316" />}
            <Bar dataKey="executionTime" name="Depois do índice" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardChart>
    </div>
  )
}
