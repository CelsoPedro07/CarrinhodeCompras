const { MongoClient } = require("mongodb")
const { faker } = require("@faker-js/faker")

const uri =
  "mongodb://admin:admin123@127.0.0.1:27017/?authSource=admin"

const client = new MongoClient(uri)

async function seedSessions() {

    try {

        await client.connect()

        console.log("MongoDB conectado")

        const db = client.db("ecommerceDB")

        const users = await db
            .collection("users")
            .find({})
            .limit(5000)
            .toArray()

        const sessions = []

        for (const user of users) {

            sessions.push({

                sessionId:
                    faker.string.uuid(),

                userId: user.userId,

                ipAddress:
                    faker.internet.ip(),

                device:
                    faker.internet.userAgent(),

                status:
                    Math.random() > 0.2
                        ? "active"
                        : "expired",

                createdAt: new Date(),

                expiresAt: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                )
            })
        }

        await db
            .collection("sessions")
            .insertMany(sessions)

        console.log("5.000 sessões inseridas")

    } catch (error) {

        console.error(error)

    } finally {

        await client.close()
    }
}

seedSessions()