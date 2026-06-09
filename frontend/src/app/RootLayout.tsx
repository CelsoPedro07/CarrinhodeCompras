import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Sidebar, navItems } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Breadcrumb } from '@/components/common/Breadcrumb'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
        <Header onOpenMobileMenu={() => setDrawerOpen(true)} />

        <div className="flex min-h-[calc(100vh-88px)]">
          <Sidebar />

          <main className="flex-1 px-4 py-6 lg:px-8 lg:ml-72">
            <Breadcrumb />
            <div className="space-y-6">
              <Outlet />
            </div>
          </main>
        </div>

        <DrawerContent className="lg:hidden">
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Menu</p>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Navegação</h2>
              </div>
              <DrawerClose asChild>
                <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/50 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-3xl px-4 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  )
}
