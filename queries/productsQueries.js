const { timedQuery, explainQuery } = require("./helpers")

async function runProductsQueries(db) {
    console.log("\n" + "=".repeat(53))
    console.log("CONSULTAS DE PRODUTOS")
    console.log("=".repeat(53))

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
    // CONSULTA 11
    // Produtos com stock baixo
    // =====================================================
    console.log("\nCONSULTA 11 - Stock Baixo\n")

    const lowStock = await timedQuery("consultaStockBaixo", async () =>
        db.collection("products").find({ stock: { $lt: 10 } }).limit(20).toArray()
    )

    console.log({ lowStockCount: lowStock.length, lowStockSample: lowStock.slice(0, 3) })
    await explainQuery(db.collection("products").find({ stock: { $lt: 10 } }).limit(20), "consultaStockBaixo")
}

module.exports = { runProductsQueries }
