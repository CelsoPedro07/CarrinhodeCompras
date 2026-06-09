import { Link, useLocation } from 'react-router-dom'

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Produtos',
  '/carts': 'Carrinhos',
  '/sessions': 'Sessões',
  '/queries': 'Performance',
  '/settings': 'Configurações',
}

export function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(Boolean)

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-100">
        Dashboard
      </Link>
      {pathnames.map((segment, index) => {
        const path = `/${pathnames.slice(0, index + 1).join('/')}`
        return (
          <span key={path} className="inline-flex items-center gap-2">
            <span>•</span>
            {index < pathnames.length - 1 ? (
              <Link to={path} className="hover:text-slate-900 dark:hover:text-slate-100">
                {routeLabels[path] ?? segment}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900 dark:text-slate-100">{routeLabels[path] ?? segment}</span>
            )}
          </span>
        )
      })}
    </div>
  )
}
