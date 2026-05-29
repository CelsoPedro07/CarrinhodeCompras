const { MongoClient } = require("mongodb")

const uri = "mongodb://admin:admin123@127.0.0.1:27017/?authSource=admin"

const client = new MongoClient(uri)

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

async function runQueries() {
    try {
        await client.connect()
        console.log("MongoDB conectado")

        const db = client.db("ecommerceDB")
        await ensureIndexes(db)

        // =====================================================
        // CONSULTA 1
        // Buscar carrinho por utilizador
        // =====================================================
        console.log("\nCONSULTA 1 - Carrinho do Utilizador\n")

        const cart = await timedQuery("consultaCarrinho", async () =>
            db.collection("carts").findOne({ userId: "U100" })
        )

        console.log({ cartResult: cart ? { userId: cart.userId, items: cart.items?.length ?? 0, totalAmount: cart.totalAmount } : null })

        await explainQuery(db.collection("carts").find({ userId: "U100" }).limit(1), "consultaCarrinho")

        // =====================================================
        // CONSULTA 2
        // Produtos com filtros e ordenação
        // =====================================================
        console.log("\nCONSULTA 2 - Produtos Filtrados\n")

        const products = await timedQuery("consultaProdutosFiltrados", async () =>
            db.collection("products")
                .find({ category: "Telefones", price: { $lt: 1000 } })
                .sort({ price: 1 })
                .limit(10)
                .toArray()
        )

        console.log({ productsCount: products.length, productsSample: products.slice(0, 3) })

        await explainQuery(db.collection("products").find({ category: "Telefones", price: { $lt: 1000 } }).sort({ price: 1 }).limit(10), "consultaProdutosFiltrados")

        // =====================================================
        // CONSULTA 3
        // Produtos mais adicionados ao carrinho
        // =====================================================
        console.log("\nCONSULTA 3 - Produtos Mais Adicionados\n")

        const aggregation = await timedQuery("aggregationProdutos", async () =>
            db.collection("carts").aggregate([
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.productId",
                        totalQuantidade: { $sum: "$items.quantity" }
                    }
                },
                { $sort: { totalQuantidade: -1 } },
                { $limit: 10 }
            ]).toArray()
        )

        console.log({ aggregationTop: aggregation })

        const explainAgg = await db.collection("carts").aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantidade: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantidade: -1 } },
            { $limit: 10 }
        ]).explain("executionStats")

        console.log("\naggregationProdutos - explain output:")
        if (explainAgg.executionStats) {
            console.log({
                executionTimeMillis: explainAgg.executionStats.executionTimeMillis,
                totalDocsExamined: explainAgg.executionStats.totalDocsExamined,
                totalKeysExamined: explainAgg.executionStats.totalKeysExamined,
                stage: explainAgg.executionStats.executionStages?.stage
            })
        } else {
            console.log(JSON.stringify(explainAgg, null, 2))
        }

        // =====================================================
        // CONSULTA 4
        // Adicionar item ao carrinho
        // =====================================================
        console.log("\nCONSULTA 4 - Adicionar Produto\n")

        await timedQuery("insercaoCarrinho", async () =>
            db.collection("carts").updateOne(
                { userId: "U100" },
                {
                    $push: {
                        items: {
                            productId: "P9999",
                            name: "Mouse Gamer",
                            price: 150,
                            quantity: 1,
                            subtotal: 150
                        }
                    }
                }
            )
        )

        console.log("Produto adicionado ao carrinho")

        // =====================================================
        // CONSULTA 5
        // Atualizar quantidade
        // =====================================================
        console.log("\nCONSULTA 5 - Atualizar Quantidade\n")

        await timedQuery("atualizarQuantidade", async () =>
            db.collection("carts").updateOne(
                { userId: "U100", "items.productId": "P9999" },
                { $inc: { "items.$.quantity": 2 } }
            )
        )

        console.log("Quantidade atualizada")

        // =====================================================
        // CONSULTA 6
        // Remover produto do carrinho
        // =====================================================
        console.log("\nCONSULTA 6 - Remover Produto\n")

        await timedQuery("removerProduto", async () =>
            db.collection("carts").updateOne(
                { userId: "U100" },
                { $pull: { items: { productId: "P9999" } } }
            )
        )

        console.log("Produto removido")

        // =====================================================
        // CONSULTA 7
        // Carrinhos abandonados
        // =====================================================
        console.log("\nCONSULTA 7 - Carrinhos Abandonados\n")

        const abandoned = await timedQuery("consultaCarrinhosAbandonados", async () =>
            db.collection("carts").find({ status: "abandoned" }).limit(20).toArray()
        )

        console.log({ abandonedCount: abandoned.length, abandonedSample: abandoned.slice(0, 3) })
        await explainQuery(db.collection("carts").find({ status: "abandoned" }).limit(20), "consultaCarrinhosAbandonados")

        // =====================================================
        // CONSULTA 8
        // Sessões ativas
        // =====================================================
        console.log("\nCONSULTA 8 - Sessões Ativas\n")

        const activeSessions = await timedQuery("consultaSessoesAtivas", async () =>
            db.collection("sessions").find({ status: "active" }).limit(20).toArray()
        )

        console.log({ activeSessionsCount: activeSessions.length, activeSessionsSample: activeSessions.slice(0, 3) })
        await explainQuery(db.collection("sessions").find({ status: "active" }).limit(20), "consultaSessoesAtivas")

        // =====================================================
        // CONSULTA 9
        // Média de preços por categoria
        // =====================================================
        console.log("\nCONSULTA 9 - Média de Preços\n")

        const averagePrices = await timedQuery("aggregationMediaPrecos", async () =>
            db.collection("products").aggregate([
                { $group: { _id: "$category", mediaPreco: { $avg: "$price" } } },
                { $sort: { mediaPreco: -1 } }
            ]).toArray()
        )

        console.log({ averagePrices })

        const explainAvg = await db.collection("products").aggregate([
            { $group: { _id: "$category", mediaPreco: { $avg: "$price" } } },
            { $sort: { mediaPreco: -1 } }
        ]).explain("executionStats")
        console.log("\naggregationMediaPrecos - explain output:")
        if (explainAvg.executionStats) {
            console.log({
                executionTimeMillis: explainAvg.executionStats.executionTimeMillis,
                totalDocsExamined: explainAvg.executionStats.totalDocsExamined,
                totalKeysExamined: explainAvg.executionStats.totalKeysExamined,
                stage: explainAvg.executionStats.executionStages?.stage
            })
        } else {
            console.log(JSON.stringify(explainAvg, null, 2))
        }

        // =====================================================
        // CONSULTA 10
        // Top utilizadores com maiores carrinhos
        // =====================================================
        console.log("\nCONSULTA 10 - Maiores Carrinhos\n")

        const topCarts = await timedQuery("consultaTopCarts", async () =>
            db.collection("carts").find({}).sort({ totalAmount: -1 }).limit(10).toArray()
        )

        console.log({ topCartsCount: topCarts.length, topCartsSample: topCarts })
        await explainQuery(db.collection("carts").find({}).sort({ totalAmount: -1 }).limit(10), "consultaTopCarts")

        // =====================================================
        // CONSULTA 11
        // Produtos com stock baixo
        // =====================================================
        console.log("\nCONSULTA 11 - Stock Baixo\n")

        const lowStock = await timedQuery("consultaStockBaixo", async () =>
            db.collection("products").find({ stock: { $lt: 10 } }).limit(20).toArray()
        )

        console.log({ lowStockCount: lowStock.length, lowStockSample: lowStock.slice(0, 3) })
        await explainQuery(db.collection("products").find({ stock: { $lt: 10 } }).limit(20), "consultaStockBaixo")

        // =====================================================
        // CONSULTA 12
        // Contagem de sessões por status
        // =====================================================
        console.log("\nCONSULTA 12 - Sessões por Status\n")

        const sessionStats = await timedQuery("aggregationSessaoStatus", async () =>
            db.collection("sessions").aggregate([{ $group: { _id: "$status", total: { $sum: 1 } } }]).toArray()
        )

        console.log({ sessionStats })

        const explainSessionStats = await db.collection("sessions").aggregate([
            { $group: { _id: "$status", total: { $sum: 1 } } }
        ]).explain("executionStats")
        console.log("\naggregationSessaoStatus - explain output:")
        if (explainSessionStats.executionStats) {
            console.log({
                executionTimeMillis: explainSessionStats.executionStats.executionTimeMillis,
                totalDocsExamined: explainSessionStats.executionStats.totalDocsExamined,
                totalKeysExamined: explainSessionStats.executionStats.totalKeysExamined,
                stage: explainSessionStats.executionStats.executionStages?.stage
            })
        } else {
            console.log(JSON.stringify(explainSessionStats, null, 2))
        }

    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
        console.log("\nConexão encerrada")
    }
}

runQueries()

