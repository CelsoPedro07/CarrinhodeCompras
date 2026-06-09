import type { QueryMetric } from '@/types'

export const queries: QueryMetric[] = [
  {
    id: 'top-products',
    name: 'Top produtos adicionados ao carrinho',
    executionTime: 72,
    docsExamined: 4200,
    keysExamined: 1350,
    usedIndex: true,
    objective: 'Identificar quais produtos são mais frequentemente incluídos em carrinhos para guiar modelação e otimização de índices.',
    query: `[
  { $unwind: '$items' },
  { $group: { _id: '$items.productId', quantity: { $sum: '$items.quantity' }, name: { $first: '$items.name' } } },
  { $sort: { quantity: -1 } },
  { $limit: 10 }
]`,
    indexName: 'IDX_CARTS_ITEMS_PRODUCT_ID',
    gainPercentage: 82,
  },
  {
    id: 'abandoned-carts',
    name: 'Taxa de abandono de carrinhos',
    executionTime: 112,
    docsExamined: 5800,
    keysExamined: 0,
    usedIndex: false,
    objective: 'Calcular a proporção de carrinhos abandonados e comparar a eficiência de consultas com e sem índice.',
    query: `[
  { $match: { status: 'abandoned' } },
  { $group: { _id: '$status', total: { $sum: 1 } } }
]`,
    indexName: 'IDX_CART_STATUS',
    gainPercentage: 35,
  },
  {
    id: 'sessions-by-hour',
    name: 'Sessões por hora',
    executionTime: 64,
    docsExamined: 3200,
    keysExamined: 900,
    usedIndex: true,
    objective: 'Avaliar os horários de maior atividade para demonstrar como a modelação de tempo e índices melhora o desempenho.',
    query: `[
  { $project: { hour: { $hour: '$createdAt' } } },
  { $group: { _id: '$hour', total: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]`,
    indexName: 'IDX_SESSIONS_CREATED_AT',
    gainPercentage: 72,
  },
  {
    id: 'average-cart-value',
    name: 'Valor médio dos carrinhos',
    executionTime: 88,
    docsExamined: 2500,
    keysExamined: 620,
    usedIndex: true,
    objective: 'Medir o valor médio dos carrinhos para validar agregações e performance em coleções desnormalizadas.',
    query: `[
  { $group: { _id: null, averageCart: { $avg: '$totalAmount' } } }
]`,
    indexName: 'IDX_CART_USER',
    gainPercentage: 54,
  },
  {
    id: 'products-by-category',
    name: 'Produtos por categoria',
    executionTime: 58,
    docsExamined: 1600,
    keysExamined: 720,
    usedIndex: true,
    objective: 'Entender a distribuição de produtos por categoria e demonstrar o uso de índices em campos de agrupamento.',
    query: `[
  { $group: { _id: '$category', total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]`,
    indexName: 'IDX_PRODUCTS_CATEGORY',
    gainPercentage: 68,
  },
]
