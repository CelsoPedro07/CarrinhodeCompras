const { MongoClient } = require("mongodb")

const uri ="mongodb://admin:admin123@localhost:27017"


const client = new MongoClient(uri)

async function seedCarts() {

    try {

        await client.connect()

        console.log("MongoDB conectado")

        const db = client.db("ecommerceDB")

        const users = await db
            .collection("users")
            .find({})
            .limit(15000)
            .toArray()

        const products = await db
            .collection("products")
            .find({})
            .toArray()

        const carts = []

        for (const user of users) {

            const totalItems =
                Math.floor(Math.random() * 5) + 1

            const items = []

            let totalAmount = 0

            for (let i = 0; i < totalItems; i++) {

                const randomProduct =
                    products[
                        Math.floor(Math.random() * products.length)
                    ]

                const quantity =
                    Math.floor(Math.random() * 3) + 1

                const subtotal =
                    randomProduct.price * quantity

                totalAmount += subtotal

                items.push({

                    productId: randomProduct.productId,

                    name: randomProduct.name,

                    price: randomProduct.price,

                    quantity,

                    subtotal
                })
            }

            carts.push({

                userId: user.userId,

                items,

                totalAmount,

                status:
                    Math.random() > 0.3
                        ? "active"
                        : "abandoned",

                createdAt: new Date(),

                updatedAt: new Date()
            })
        }

        await db.collection("carts").insertMany(carts)

        console.log("15.000 carrinhos inseridos")

    } catch (error) {

        console.error(error)

    } finally {

        await client.close()
    }
}

seedCarts()