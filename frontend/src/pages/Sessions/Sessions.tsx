import { useMemo } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SectionHeader } from '@/components/common/SectionHeader'
import { SessionMetrics } from '@/pages/Sessions/SessionMetrics'
import { SessionTable } from '@/pages/Sessions/SessionTable'
import { DashboardChart } from '@/components/charts/DashboardChart'
import { useSessions } from '@/hooks/useSessions'
import { useUsers } from '@/hooks/useUsers'
import { Skeleton } from '@/components/ui/skeleton'

const statusColors = {
  active: '#22c55e',
  expired: '#f97316',
}

export function Sessions() {
  const sessionsQuery = useSessions()
  const usersQuery = useUsers()

  const sessions = sessionsQuery.data ?? []
  const users = usersQuery.data ?? []

  const activeSessions = useMemo(() => sessions.filter((session) => session.status === 'active').length, [sessions])
  const expiredSessions = useMemo(() => sessions.filter((session) => session.status === 'expired').length, [sessions])
  const averageDuration = useMemo(() => {
    const sum = sessions.reduce((acc, session) => {
      const start = new Date(session.createdAt).getTime()
      const end = new Date(session.expiresAt).getTime()
      return acc + (end - start) / 60000 // em minutos
    }, 0)
    return sessions.length ? sum / sessions.length : 0
  }, [sessions])

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

  const sessionsByDay = useMemo(() => {
    const groups = sessions.reduce<Record<string, number>>((acc, session) => {
      const date = new Date(session.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      acc[date] = (acc[date] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(groups).map(([date, count]) => ({ date, count }))
  }, [sessions])

  const sessionsByStatus = useMemo(() => {
    const groups = sessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.status] = (acc[session.status] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(groups).map(([status, count]) => ({ status, count }))
  }, [sessions])

  return (
    <div className="space-y-6">
      <SectionHeader title="Sessões" description="Visualize sessões de usuários, tempo médio e atividade ao longo do tempo." />

      {sessionsQuery.isLoading || usersQuery.isLoading ? (
        <SessionMetrics activeSessions={0} endedSessions={0} averageDuration={0} />
      ) : (
        <SessionMetrics activeSessions={activeSessions} endedSessions={expiredSessions} averageDuration={averageDuration} />
      )}

      {sessionsQuery.isLoading || usersQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[320px] rounded-3xl" />
          <Skeleton className="h-[320px] rounded-3xl" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <DashboardChart title="Sessões por Hora">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sessionsByHour} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sessionHourGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#sessionHourGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </DashboardChart>

          <DashboardChart title="Sessões por Dia">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionsByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[12, 12, 0, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardChart>

          <DashboardChart title="Status das Sessões">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionsByStatus} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                  {sessionsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={statusColors[entry.status] ?? '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </DashboardChart>
        </div>
      )}

      {sessionsQuery.isLoading || usersQuery.isLoading ? (
        <Skeleton className="h-[520px] rounded-3xl" />
      ) : (
        <SessionTable sessions={sessions} users={users} />
      )}
    </div>
  )
}
