const { MongoClient } = require("mongodb")
const { ensureIndexes } = require("./helpers")
const { runCartsQueries } = require("./cartsQueries")
const { runProductsQueries } = require("./productsQueries")
const { runSessionsQueries } = require("./sessionsQueries")

const uri = "mongodb://admin:admin123@127.0.0.1:27017/?authSource=admin"

const client = new MongoClient(uri)

async function runQueries() {
    try {
        await client.connect()
        console.log("MongoDB conectado")

        const db = client.db("ecommerceDB")
        await ensureIndexes(db)

        await runCartsQueries(db)
        await runProductsQueries(db)
        await runSessionsQueries(db)

    } catch (error) {
        console.error(error)
    } finally {
        await client.close()
        console.log("\nConexão encerrada")
    }
}

runQueries()

