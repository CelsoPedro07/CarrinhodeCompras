import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CartMetricsProps {
  totalCarts: number
  averageTicket: number
  abandonedCount: number
  maxCart: number
}

export function CartMetrics({ totalCarts, averageTicket, abandonedCount, maxCart }: CartMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Carrinhos</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-100">{totalCarts}</p>
          </div>
          <Badge>Receita</Badge>
        </div>
      </Card>
      <Card className="space-y-3 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ticket Médio</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-100">R$ {averageTicket.toFixed(2)}</p>
        </div>
      </Card>
      <Card className="space-y-3 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Carrinhos Abandonados</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-100">{abandonedCount}</p>
        </div>
      </Card>
      <Card className="space-y-3 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Maior Carrinho</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-100">R$ {maxCart.toFixed(2)}</p>
        </div>
      </Card>
    </div>
  )
}
