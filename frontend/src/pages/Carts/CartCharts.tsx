import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { Cart } from '@/types'

interface CartChartsProps {
  carts: Cart[]
}

export function CartCharts({ carts }: CartChartsProps) {
  const cartsByHour = Array.from(
    carts.reduce<Map<string, number>>((acc, cart) => {
      const hour = new Date(cart.updatedAt).getHours().toString().padStart(2, '0')
      acc.set(hour, (acc.get(hour) ?? 0) + 1)
      return acc
    }, new Map())
  ).map(([hour, count]) => ({ hour: `${hour}h`, count }))

  const statusRates = Array.from(
    carts.reduce<Map<string, number>>((acc, cart) => {
      acc.set(cart.status, (acc.get(cart.status) ?? 0) + 1)
      return acc
    }, new Map())
  ).map(([status, count]) => ({ status, count }))

  const topCarts = carts
    .slice()
    .sort((a, b) => (b.totalAmount ?? 0) - (a.totalAmount ?? 0))
    .slice(0, 5)
    .map((cart, idx) => ({ label: `Cart ${idx + 1}`, value: cart.totalAmount ?? 0 }))

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <DashboardChart title="Carrinhos por Hora">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cartsByHour} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}`, 'Carrinhos']} />
            <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardChart>

      <DashboardChart title="Top Carrinhos">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={topCarts} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`R$ ${value}`, 'Total']} />
            <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#d9f99d" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardChart>

      <DashboardChart title="Taxa de Abandono">
        <div className="flex h-full flex-col justify-center">
          {statusRates.map((item) => (
            <div key={item.status} className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>{item.status}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{ width: `${(item.count / carts.length) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardChart>
    </div>
  )
}
