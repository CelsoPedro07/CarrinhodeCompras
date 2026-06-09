const { timedQuery, explainQuery } = require("./helpers")

async function runCartsQueries(db) {
    console.log("\n" + "=".repeat(53))
    console.log("CONSULTAS DE CARRINHOS")
    console.log("=".repeat(53))

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
    // CONSULTA 10
    // Top utilizadores com maiores carrinhos
    // =====================================================
    console.log("\nCONSULTA 10 - Maiores Carrinhos\n")

    const topCarts = await timedQuery("consultaTopCarts", async () =>
        db.collection("carts").find({}).sort({ totalAmount: -1 }).limit(10).toArray()
    )

    console.log({ topCartsCount: topCarts.length, topCartsSample: topCarts })
    await explainQuery(db.collection("carts").find({}).sort({ totalAmount: -1 }).limit(10), "consultaTopCarts")
}

module.exports = { runCartsQueries }
