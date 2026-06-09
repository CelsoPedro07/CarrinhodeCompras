import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/app/RootLayout'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Products } from '@/pages/Products/Products'
import { Carts } from '@/pages/Carts/Carts'
import { Sessions } from '@/pages/Sessions/Sessions'
import { Queries } from '@/pages/Queries/Queries'
import { Architecture } from '@/pages/Architecture/Architecture'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="products" element={<Products />} />
        <Route path="carts" element={<Carts />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="queries" element={<Queries />} />
        <Route path="settings" element={<div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">Em breve: área de configurações</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
