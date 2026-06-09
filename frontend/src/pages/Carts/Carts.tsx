import { useMemo } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { CartMetrics } from '@/pages/Carts/CartMetrics'
import { CartCharts } from '@/pages/Carts/CartCharts'
import { CartTable } from '@/pages/Carts/CartTable'
import { useCarts } from '@/hooks/useCarts'
import { useUsers } from '@/hooks/useUsers'
import { Skeleton } from '@/components/ui/skeleton'

export function Carts() {
  const cartsQuery = useCarts()
  const usersQuery = useUsers()

  const carts = cartsQuery.data ?? []
  const users = usersQuery.data ?? []

  const totalCarts = carts.length
  const averageTicket = useMemo(
    () => (carts.length ? carts.reduce((sum, cart) => sum + (cart.totalAmount ?? 0), 0) / carts.length : 0),
    [carts]
  )
  const abandonedCount = carts.filter((cart) => cart.status === 'abandoned').length
  const maxCart = useMemo(() => (carts.length ? Math.max(...carts.map((cart) => cart.totalAmount ?? 0)) : 0), [carts])

  return (
    <div className="space-y-6">
      <SectionHeader title="Carrinhos" description="Acompanhe valor médio, carrinhos abandonados e o maior tickets do sistema." />

      <CartMetrics totalCarts={totalCarts} averageTicket={averageTicket} abandonedCount={abandonedCount} maxCart={maxCart} />

      {cartsQuery.isLoading || usersQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-3xl" />
          ))}
        </div>
      ) : (
        <CartCharts carts={carts} />
      )}

      {cartsQuery.isLoading || usersQuery.isLoading ? (
        <Skeleton className="h-[520px] rounded-3xl" />
      ) : (
        <CartTable carts={carts} users={users} />
      )}
    </div>
  )
}
