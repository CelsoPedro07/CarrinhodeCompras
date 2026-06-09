import { Database, Box, Users, ShoppingBag, Activity, Sparkles } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/components/common/SectionHeader'

const collections = [
  {
    title: 'products',
    icon: Box,
    fields: ['_id', 'name', 'category', 'brand', 'price', 'stock', 'rating', 'createdAt'],
    description: 'Documentos de produtos com atributos de categoria e preço para facilitar filtros e agregações.',
  },
  {
    title: 'users',
    icon: Users,
    fields: ['_id', 'name', 'email', 'phone', 'createdAt'],
    description: 'Usuários armazenados de forma simples para evitar duplicação e manter referência leve em outras coleções.',
  },
  {
    title: 'carts',
    icon: ShoppingBag,
    fields: ['_id', 'userId', 'items', 'totalAmount', 'status', 'createdAt', 'updatedAt'],
    description: 'Carrinhos desnormalizados com itens embutidos e snapshot de preço para análise de comportamento.',
  },
  {
    title: 'sessions',
    icon: Activity,
    fields: ['_id', 'sessionId', 'userId', 'ipAddress', 'device', 'status', 'createdAt', 'expiresAt'],
    description: 'Sessões orientadas por tempo para observar picos de acesso e padrões de expiração.',
  },
]

export function Architecture() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Arquitetura NoSQL"
        description="Explicação visual das coleções, decisões de modelação e uso de índices para observabilidade." 
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Visão geral do modelo</CardTitle>
              <CardDescription>
                Este projeto usa MongoDB como fonte analítica. O foco é modelar coleções para operações de leitura, agregação e performance, não um processo de e-commerce transacional.
              </CardDescription>
            </CardHeader>
            <div className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p><span className="font-semibold text-slate-900 dark:text-slate-100">Desnormalização controlada</span>: os carrinhos embutem itens com snapshot de preço para evitar joins pesados e suportar análises históricas.</p>
              <p><span className="font-semibold text-slate-900 dark:text-slate-100">Coleções focadas em consulta</span>: cada coleção responde a um domínio analítico distinto — produtos, usuários, carrinhos e sessões.</p>
              <p><span className="font-semibold text-slate-900 dark:text-slate-100">Índices estratégicos</span>: índices em `category`, `status`, `createdAt` e `userId` aceleram filtros e pipelines de agregação.</p>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {collections.map((collection) => {
              const Icon = collection.icon
              return (
                <Card key={collection.title} className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-600 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">{collection.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Coleção principal</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <p className="font-medium">Campos chave</p>
                      <p>{collection.fields.join(', ')}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{collection.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Mapa de Coleções</CardTitle>
            <CardDescription>Relações e decisões de design no modelo de dados.</CardDescription>
          </CardHeader>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-600 text-white">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">NoSQL orientado a leitura</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cada coleção serve um propósito analítico específico.</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-semibold">products</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Índice por categoria para filtros rápidos e agregação por price/rating.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-semibold">users</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Referência leve usada em análises de sessões e comportamento de usuários.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-semibold">carts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Itens embutidos suportam pipelines de abandono e valor médio sem joins caros.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="font-semibold">sessions</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Estrutura temporal para detectar picos e duração de sessões.</p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-4 text-sm text-slate-100 shadow-lg shadow-slate-900/10">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                  <p className="font-semibold">Decisão de design</p>
                </div>
                <p className="mt-2 text-slate-300">A desnormalização é usada onde o custo de atualização é baixo e o benefício em velocidade de leitura é alto.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
