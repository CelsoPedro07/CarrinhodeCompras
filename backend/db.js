const { MongoClient } = require('mongodb')

const MONGO_URI = 'mongodb://admin:admin123@localhost:27017'
const DB_NAME = 'ecommerceDB'

const client = new MongoClient(MONGO_URI)
let db = null

async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(DB_NAME)
    console.log('✓ Connected to MongoDB')
  }
  return db
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.')
  }
  return db
}

async function closeDB() {
  if (client) {
    await client.close()
  }
  db = null
}

module.exports = {
  connectDB,
  getDb,
  closeDB,
}
