import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, Package, ShoppingCart, User, Clock3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { InsightCard } from '@/components/cards/InsightCard'
import { MetricCard } from '@/components/cards/MetricCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useCarts } from '@/hooks/useCarts'
import { useProducts } from '@/hooks/useProducts'
import { useQueryMetrics } from '@/hooks/useQueryMetrics'
import { useSessions } from '@/hooks/useSessions'
import { useUsers } from '@/hooks/useUsers'
import { Skeleton } from '@/components/ui/skeleton'

const categoryColors = ['#0ea5e9', '#f97316', '#14b8a6', '#a855f7', '#facc15']

export function Dashboard() {
  const productsQuery = useProducts()
  const usersQuery = useUsers()
  const cartsQuery = useCarts()
  const sessionsQuery = useSessions()
  const queriesQuery = useQueryMetrics()

  const products = productsQuery.data ?? []
  const users = usersQuery.data ?? []
  const carts = cartsQuery.data ?? []
  const sessions = sessionsQuery.data ?? []
  const queries = queriesQuery.data ?? []

  const totalProducts = products.length
  const totalUsers = users.length
  const totalCarts = carts.length
  const totalSessions = sessions.length
  const activeSessionsCount = useMemo(() => sessions.filter((item) => item.status === 'active').length, [sessions])
  const abandonedCartsCount = useMemo(() => carts.filter((cart) => cart.status === 'abandoned').length, [carts])
  const averageCartValue = useMemo(
    () => (carts.length ? carts.reduce((sum, cart) => sum + cart.totalAmount, 0) / carts.length : 0),
    [carts]
  )
  const abandonmentRate = totalCarts ? Math.round((abandonedCartsCount / totalCarts) * 100) : 0
  const averageQueryTime = useMemo(
    () => (queries.length ? queries.reduce((sum, item) => sum + item.executionTime, 0) / queries.length : 0),
    [queries]
  )

  const productsByCategory = useMemo(() => {
    const groups = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(groups).map(([category, count]) => ({ category, count }))
  }, [products])

  const cartsByDay = useMemo(() => {
    const groups = carts.reduce<Record<string, number>>((acc, cart) => {
      const date = new Date(cart.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      acc[date] = (acc[date] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(groups).map(([date, count]) => ({ date, count }))
  }, [carts])

  const cartStatus = useMemo(() => {
    const groups = carts.reduce<Record<string, number>>((acc, cart) => {
      acc[cart.status] = (acc[cart.status] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(groups).map(([status, count]) => ({ status, count }))
  }, [carts])

  const sessionsByHour = useMemo(() => {
    const groups = sessions.reduce<Record<string, number>>((acc, session) => {
      const hour = new Date(session.createdAt).getHours().toString().padStart(2, '0')
      acc[hour] = (acc[hour] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(groups)
      .map(([hour, count]) => ({ hour: `${hour}h`, count }))
      .sort((a, b) => Number(a.hour.replace('h', '')) - Number(b.hour.replace('h', '')))
  }, [sessions])

  const mostPopularProduct = useMemo(() => {
    const counts = carts.reduce<Record<string, { name: string; count: number }>>((acc, cart) => {
      cart.items.forEach((item) => {
        acc[item.productId] = acc[item.productId] ?? { name: item.name, count: 0 }
        acc[item.productId].count += item.quantity
      })
      return acc
    }, {})

    const best = Object.values(counts).sort((a, b) => b.count - a.count)[0]
    return best ? `${best.name} (${best.count} vezes)` : 'Sem dados suficientes'
  }, [carts])

  const peakHour = useMemo(() => {
    const groups = sessions.reduce<Record<string, number>>((acc, session) => {
      const hour = new Date(session.createdAt).getHours().toString().padStart(2, '0')
      acc[hour] = (acc[hour] ?? 0) + 1
      return acc
    }, {})

    const top = Object.entries(groups).sort((a, b) => b[1] - a[1])[0]
    return top ? `${top[0]}h` : 'N/A'
  }, [sessions])

  const userWithMostSessions = useMemo(() => {
    const counts = sessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.userId] = (acc[session.userId] ?? 0) + 1
      return acc
    }, {})

    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const user = users.find((user) => user.userId === top?.[0])
    return top ? `${user?.name ?? top[0]} (${top[1]} sessões)` : 'Sem dados suficientes'
  }, [sessions, users])

  const biggestCartValue = useMemo(() => {
    const best = carts.reduce((current, cart) => (cart.totalAmount > current.totalAmount ? cart : current), carts[0] ?? { totalAmount: 0 })
    return best ? `R$ ${best.totalAmount.toFixed(2)}` : '0'
  }, [carts])

  const queryPerformanceData = useMemo(
    () =>
      queries.slice(0, 5).map((query) => ({
        name: query.name,
        executionTime: query.executionTime,
        baselineExecutionTime: query.baselineExecutionTime ?? 0,
      })),
    [queries]
  )

  return (
    <div className="space-y-6">
      <SectionHeader title="Visão geral" description="Indicadores de desempenho do ecossistema de carrinhos e sessões." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Produtos" value={totalProducts.toString()} icon={<Package className="h-6 w-6" />} />
        <MetricCard label="Total Usuários" value={totalUsers.toString()} icon={<User className="h-6 w-6" />} />
        <MetricCard label="Total Carrinhos" value={totalCarts.toString()} icon={<ShoppingCart className="h-6 w-6" />} />
        <MetricCard label="Total Sessões" value={totalSessions.toString()} icon={<Activity className="h-6 w-6" />} />
        <MetricCard label="Tempo Médio de Consulta" value={`${averageQueryTime.toFixed(0)} ms`} icon={<Clock3 className="h-6 w-6" />} />
      </div>

      {productsQuery.isLoading || usersQuery.isLoading || cartsQuery.isLoading || sessionsQuery.isLoading || queriesQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <InsightCard
            title="Categoria mais popular"
            value={productsByCategory.sort((a, b) => b.count - a.count)[0]?.category ?? 'N/A'}
            description="Mostra a categoria mais frequente entre os produtos disponíveis." 
            badge="Tomada de decisão"
          />
          <InsightCard
            title="Produto mais presente"
            value={mostPopularProduct}
            description="Indica o produto com maior presença agregada nos carrinhos." 
            badge="Prioridade"
          />
          <InsightCard
            title="Horário de maior atividade"
            value={peakHour}
            description="Identifica o período com mais sessões iniciadas." 
            badge="Pico de uso"
          />
          <InsightCard
            title="Taxa de abandono"
            value={`${abandonmentRate}%`}
            description="Percentual de carrinhos que não foram convertidos em compra." 
            badge="Insight UX"
          />
          <InsightCard
            title="Usuário com mais sessões"
            value={userWithMostSessions}
            description="Mostra o usuário mais ativo em termos de número de sessões." 
            badge="Comportamento"
          />
          <InsightCard
            title="Carrinho de maior valor"
            value={biggestCartValue}
            description="Destaca o maior carrinho registrado para análise de receita e comportamento." 
            badge="Valor"
          />
        </div>
      )}

      {productsQuery.isLoading || cartsQuery.isLoading || sessionsQuery.isLoading || queriesQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-[420px] rounded-3xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardChart title="Carrinhos por estado">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={cartStatus} dataKey="count" nameKey="status" outerRadius={100} innerRadius={48} paddingAngle={4}>
                    {cartStatus.map((entry, index) => (
                      <Cell key={`status-cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} carrinhos`, 'Total']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </DashboardChart>

            <DashboardChart title="Sessões Ativas por Hora">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={sessionsByHour} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="activeSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#14b8a6" fill="url(#activeSessions)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </DashboardChart>
          </div>

          <DashboardChart title="Performance de consultas (antes/depois do índice)">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={queryPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [`${value} ms`, name === 'baselineExecutionTime' ? 'Antes do índice' : 'Depois do índice']} />
                <Legend wrapperStyle={{ color: '#64748b' }} />
                <Bar dataKey="baselineExecutionTime" name="Antes do índice" fill="#f97316" />
                <Bar dataKey="executionTime" name="Depois do índice" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardChart>
        </>
      )}

      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Narrativa analítica</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A plataforma une métricas operacionais e insights em uma visão única. O foco é demonstrar o comportamento das coleções e o impacto dos índices em consultas chave.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <p className="font-semibold">Por que essa visão importa</p>
            <p className="mt-2">Avaliar taxa de abandono e valor médio do carrinho ajuda a mostrar como o modelo NoSQL suporta análises de comportamento sem precisar de pipeline complexo em tempo real.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <p className="font-semibold">Melhorias de performance</p>
            <p className="mt-2">Os cartões de consultas destacam quais pipelines são mais rápidos, quais usam índices e onde há oportunidade de otimização.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
