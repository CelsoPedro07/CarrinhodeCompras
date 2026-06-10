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
    .then(() => {
        // Notify backend via socket.io that queries finished
        try {
            const { io } = require('socket.io-client')
            const socket = io('http://localhost:5000')

            socket.on('connect', () => {
                console.log('Connected to backend socket, notifying queries done')
                socket.emit('queries:done')
                socket.disconnect()
            })

            socket.on('connect_error', (err) => {
                console.error('Socket connect error:', err)
            })
        } catch (err) {
            console.error('Failed to notify backend via socket:', err)
        }
    })

