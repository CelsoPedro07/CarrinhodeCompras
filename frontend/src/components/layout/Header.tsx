import { useTheme } from '@/hooks/useTheme'
import { Menu, Moon, Search, Sun } from 'lucide-react'

interface HeaderProps {
  onOpenMobileMenu: () => void
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/50 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden items-center rounded-3xl border border-slate-200 bg-slate-100 px-4 py-2 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex">
          <Search className="mr-3 h-4 w-4" />
          <input
            placeholder="Buscar métricas, produtos..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/50 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="hidden rounded-3xl border border-slate-200 bg-slate-100 px-4 py-2 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 md:block">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Projeto</p>
          <p className="text-sm font-semibold">Carrinho NoSQL</p>
        </div>
      </div>
    </header>
  )
}
