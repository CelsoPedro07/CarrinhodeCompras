const { connectDB, getDb } = require('../db')

const queryDefinitions = [
  {
    id: 'user-cart',
    name: 'Carrinho do usuário',
    objective: 'Identificar o carrinho de um usuário específico e demonstrar o impacto do índice em userId.',
    query: `db.carts.find({ userId: 'U100' }).limit(1)`,
    collection: 'carts',
    type: 'find',
    filter: { userId: 'U100' },
    projection: { userId: 1, totalAmount: 1, status: 1, items: 1 },
    limit: 1,
    indexName: 'IDX_CART_USERID',
    hintNatural: true,
    sampleFields: ['userId', 'status', 'totalAmount', 'items'],
  },
  {
    id: 'products-filtered',
    name: 'Produtos filtrados',
    objective: 'Buscar produtos por categoria e preço usando índice composto em category + price.',
    query: `db.products.find({ category: 'Telefones', price: { $lt: 1000 } }).sort({ price: 1 }).limit(10)`,
    collection: 'products',
    type: 'find',
    filter: { category: 'Telefones', price: { $lt: 1000 } },
    projection: { name: 1, category: 1, price: 1, stock: 1 },
    sort: { price: 1 },
    limit: 10,
    indexName: 'IDX_PRODUCTS_CATEGORY_PRICE',
    hintNatural: true,
    sampleFields: ['name', 'category', 'price', 'stock'],
  },
  {
    id: 'abandoned-carts',
    name: 'Carrinhos abandonados',
    objective: 'Calcular carrinhos abandonados e demonstrar a eficiência de filtros sobre o campo status.',
    query: `db.carts.find({ status: 'abandoned' }).limit(20)`,
    collection: 'carts',
    type: 'find',
    filter: { status: 'abandoned' },
    projection: { userId: 1, totalAmount: 1, status: 1 },
    limit: 20,
    indexName: 'IDX_CART_STATUS',
    hintNatural: true,
    sampleFields: ['userId', 'status', 'totalAmount'],
  },
  {
    id: 'active-sessions',
    name: 'Sessões ativas',
    objective: 'Contabilizar sessões ativas e validar índices em status na coleção de sessões.',
    query: `db.sessions.find({ status: 'active' }).limit(20)`,
    collection: 'sessions',
    type: 'find',
    filter: { status: 'active' },
    projection: { userId: 1, status: 1, createdAt: 1, expiresAt: 1 },
    limit: 20,
    indexName: 'IDX_SESSIONS_STATUS',
    hintNatural: true,
    sampleFields: ['userId', 'status', 'createdAt'],
  },
  {
    id: 'top-carts',
    name: 'Maiores carrinhos',
    objective: 'Identificar os carrinhos de maior valor e comparar ordenação com índice por totalAmount.',
    query: `db.carts.find({}).sort({ totalAmount: -1 }).limit(10)`,
    collection: 'carts',
    type: 'find',
    filter: {},
    projection: { userId: 1, totalAmount: 1, status: 1 },
    sort: { totalAmount: -1 },
    limit: 10,
    indexName: 'IDX_CART_TOTAL_AMOUNT',
    hintNatural: true,
    sampleFields: ['userId', 'totalAmount', 'status'],
  },
  {
    id: 'popular-products',
    name: 'Produtos mais adicionados',
    objective: 'Agregação que identifica os produtos mais populares dentro dos carrinhos.',
    query: `db.carts.aggregate([ { $unwind: '$items' }, { $group: { _id: '$items.productId', totalQuantity: { $sum: '$items.quantity' } } }, { $sort: { totalQuantity: -1 } }, { $limit: 10 } ])`,
    collection: 'carts',
    type: 'aggregate',
    pipeline: [
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', totalQuantity: { $sum: '$items.quantity' }, productName: { $first: '$items.name' } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ],
    limit: 10,
    indexName: 'IDX_CARTS_ITEMS_PRODUCT_ID',
    hintNatural: false,
    sampleFields: ['productName', 'totalQuantity'],
  },
  {
    id: 'average-price-category',
    name: 'Média de preço por categoria',
    objective: 'Calcular o preço médio por categoria com agregação de produtos.',
    query: `db.products.aggregate([ { $group: { _id: '$category', avgPrice: { $avg: '$price' } } }, { $sort: { avgPrice: -1 } } ])`,
    collection: 'products',
    type: 'aggregate',
    pipeline: [
      { $group: { _id: '$category', avgPrice: { $avg: '$price' } } },
      { $sort: { avgPrice: -1 } },
    ],
    limit: 10,
    indexName: 'IDX_PRODUCTS_CATEGORY_PRICE',
    hintNatural: false,
    sampleFields: ['_id', 'avgPrice'],
  },
]

async function ensureIndexes(db) {
  await Promise.all([
    db.collection('carts').createIndex({ userId: 1 }),
    db.collection('carts').createIndex({ status: 1 }),
    db.collection('carts').createIndex({ totalAmount: -1 }),
    db.collection('products').createIndex({ category: 1, price: 1 }),
    db.collection('products').createIndex({ stock: 1 }),
    db.collection('sessions').createIndex({ status: 1 }),
  ])
}

async function explainCursor(cursor) {
  const explain = await cursor.explain('executionStats')
  const plan = explain.executionStats || explain
  return {
    executionTime: plan.executionTimeMillis ?? 0,
    docsExamined: plan.totalDocsExamined ?? 0,
    keysExamined: plan.totalKeysExamined ?? 0,
    stage: plan.executionStages?.stage ?? explain.queryPlanner?.winningPlan?.stage ?? 'UNKNOWN',
    usedIndex: (plan.totalKeysExamined ?? 0) > 0,
  }
}

async function runExplanation(db, definition, baseline = false) {
  const collection = db.collection(definition.collection)
  let cursor

  if (definition.type === 'find') {
    cursor = collection.find(definition.filter, { projection: definition.projection || {} })
    if (definition.sort) cursor = cursor.sort(definition.sort)
    if (definition.limit) cursor = cursor.limit(definition.limit)
    if (baseline && definition.hintNatural) cursor = cursor.hint({ $natural: 1 })
  } else {
    cursor = collection.aggregate(definition.pipeline || [])
    if (definition.limit) cursor = cursor.limit(definition.limit)
    if (baseline && definition.hintNatural) cursor = cursor.hint({ $natural: 1 })
  }

  return explainCursor(cursor)
}

async function executeSample(db, definition) {
  const collection = db.collection(definition.collection)

  if (definition.type === 'find') {
    let cursor = collection.find(definition.filter, { projection: definition.projection || {} })
    if (definition.sort) cursor = cursor.sort(definition.sort)
    if (definition.limit) cursor = cursor.limit(definition.limit)
    return cursor.toArray()
  }

  let cursor = collection.aggregate(definition.pipeline || [])
  if (definition.limit) cursor = cursor.limit(definition.limit)
  return cursor.toArray()
}

async function getQueryPerformance() {
  await connectDB()
  const db = getDb()
  await ensureIndexes(db)

  const queries = []

  for (const definition of queryDefinitions) {
    const actual = await runExplanation(db, definition, false)
    const baseline = definition.hintNatural ? await runExplanation(db, definition, true) : null
    const resultSample = await executeSample(db, definition)
    const gainPercentage = baseline && baseline.executionTime > 0
      ? Math.round(((baseline.executionTime - actual.executionTime) / baseline.executionTime) * 100)
      : null

    queries.push({
      id: definition.id,
      name: definition.name,
      objective: definition.objective,
      query: definition.query,
      indexName: definition.indexName,
      executionTime: actual.executionTime,
      docsExamined: actual.docsExamined,
      keysExamined: actual.keysExamined,
      usedIndex: actual.usedIndex,
      stage: actual.stage,
      baselineExecutionTime: baseline?.executionTime ?? null,
      baselineDocsExamined: baseline?.docsExamined ?? null,
      baselineKeysExamined: baseline?.keysExamined ?? null,
      baselineUsedIndex: baseline?.usedIndex ?? null,
      gainPercentage,
      resultSample: resultSample.slice(0, 5),
      resultFields: definition.sampleFields,
    })
  }

  return { data: queries }
}

module.exports = {
  getQueryPerformance,
}
