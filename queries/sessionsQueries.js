const { timedQuery, explainQuery } = require("./helpers")

async function runSessionsQueries(db) {
    console.log("\n" + "=".repeat(53))
    console.log("CONSULTAS DE SESSÕES")
    console.log("=".repeat(53))

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
}

module.exports = { runSessionsQueries }
