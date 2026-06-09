import { InputHTMLAttributes } from 'react'

interface ProductFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  categoryValue: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function ProductFilters({
  searchValue,
  onSearchChange,
  categoryValue,
  onCategoryChange,
  categories,
}: ProductFiltersProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
        Buscar
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Pesquisar produtos"
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-500/20"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
        Categoria
        <select
          value={categoryValue}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-500/20"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
