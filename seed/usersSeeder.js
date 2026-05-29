const { MongoClient } = require("mongodb")
const { faker } = require("@faker-js/faker")

const uri = "mongodb://admin:admin123@localhost:27017"

const client = new MongoClient(uri)

async function seedUsers() {

    try {

        await client.connect()

        const db = client.db("ecommerceDB")

        const users = []

        for (let i = 0; i < 50000; i++) {

            users.push({

                userId: `U${i + 1}`,

                name: faker.person.fullName(),

                email: faker.internet.email(),

                phone: faker.phone.number(),

                createdAt: new Date()

            })
        }

        await db.collection("users").insertMany(users)

        console.log("50.000 utilizadores inseridos")

    } catch (error) {

        console.error(error)

    } finally {

        await client.close()
    }
}

seedUsers()