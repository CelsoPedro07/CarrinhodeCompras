import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Box, Users, Activity, Settings, Database } from 'lucide-react'

export const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Arquitetura NoSQL', to: '/architecture', icon: Database },
  { label: 'Produtos', to: '/products', icon: Box },
  { label: 'Carrinhos', to: '/carts', icon: ShoppingBag },
  { label: 'Sessões', to: '/sessions', icon: Users },
  { label: 'Performance', to: '/queries', icon: Activity },
  { label: 'Configurações', to: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:px-5 lg:py-6 lg:border-r lg:border-slate-200 lg:bg-slate-50 lg:dark:border-slate-800 lg:dark:bg-slate-950 lg:fixed lg:left-0 lg:top-[88px] lg:h-[calc(100vh-88px)] lg:overflow-auto">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-600 text-white shadow-lg shadow-sky-500/20">
          <span className="text-lg font-semibold">CD</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Carrinho Analytics</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monitoramento NoSQL</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 pb-6">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
