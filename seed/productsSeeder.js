const { MongoClient } = require("mongodb")
const { faker } = require("@faker-js/faker")

const uri = "mongodb://admin:admin123@localhost:27017"
const client = new MongoClient(uri)

async function seedProducts() {

    try {

        await client.connect()

        console.log("MongoDB conectado")

        const db = client.db("ecommerceDB")

        const products = []

        const categories = [
            "Telefones",
            "Computadores",
            "Acessorios",
            "Gaming",
            "Audio",
            "TV"
        ]

        const brands = [
            "Samsung",
            "Apple",
            "Sony",
            "HP",
            "Dell",
            "Lenovo",
            "LG"
        ]

        for (let i = 0; i < 30000; i++) {

            products.push({

                productId: `P${i + 1}`,

                name: faker.commerce.productName(),

                category:
                    categories[
                        Math.floor(Math.random() * categories.length)
                    ],

                brand:
                    brands[
                        Math.floor(Math.random() * brands.length)
                    ],

                price: Number(
                    faker.commerce.price({
                        min: 50,
                        max: 5000
                    })
                ),

                stock: faker.number.int({
                    min: 1,
                    max: 500
                }),

                rating: Number(
                    faker.number.float({
                        min: 1,
                        max: 5,
                        fractionDigits: 1
                    })
                ),

                createdAt: new Date()
            })
        }

        await db.collection("products").insertMany(products)

        console.log("30.000 produtos inseridos")

    } catch (error) {

        console.error(error)

    } finally {

        await client.close()
    }
}

seedProducts()