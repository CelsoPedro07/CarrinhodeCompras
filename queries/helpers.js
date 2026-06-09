async function ensureIndexes(db) {
    console.log("Criando índices para testes de desempenho...")

    await Promise.all([
        db.collection("carts").createIndex({ userId: 1 }),
        db.collection("carts").createIndex({ status: 1 }),
        db.collection("carts").createIndex({ totalAmount: -1 }),
        db.collection("products").createIndex({ category: 1, price: 1 }),
        db.collection("products").createIndex({ stock: 1 }),
        db.collection("sessions").createIndex({ status: 1 })
    ])

    console.log("Índices criados com sucesso.\n")
}

async function explainQuery(findCursor, label) {
    const explain = await findCursor.explain("executionStats")
    console.log(`\n${label} - explain.executionStats:`)
    console.log({
        executionTimeMillis: explain.executionStats.executionTimeMillis,
        totalDocsExamined: explain.executionStats.totalDocsExamined,
        totalKeysExamined: explain.executionStats.totalKeysExamined,
        stage: explain.executionStats.executionStages.stage
    })
    return explain
}

async function timedQuery(label, fn) {
    console.time(label)
    const result = await fn()
    console.timeEnd(label)
    return result
}

module.exports = {
    ensureIndexes,
    explainQuery,
    timedQuery
}
