const { getDb } = require('../db')
const { ObjectId } = require('mongodb')

async function getProducts({ page = 1, limit = 20 }) {
  const db = getDb()
  const skip = (page - 1) * limit
  const products = await db
    .collection('products')
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection('products').countDocuments()

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

async function getProductStats() {
  const db = getDb()

  const stats = await db
    .collection('products')
    .aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
        },
      },
    ])
    .toArray()

  return { data: stats }
}


async function createProduct(data) {
  const db = getDb()
  const now = new Date()
  const doc = {
    name: data.name,
    category: data.category || 'Uncategorized',
    brand: data.brand || null,
    price: Number(data.price) || 0,
    stock: Number(data.stock) || 0,
    rating: Number(data.rating) || 0,
    createdAt: now,
    updatedAt: now,
  }
  const result = await db.collection('products').insertOne(doc)
  return { data: { ...doc, _id: result.insertedId } }
}

async function updateProduct(id, data) {
  const db = getDb()
  const _id = typeof id === 'string' ? new ObjectId(id) : id
  const update = {
    $set: {
      ...data,
      price: data.price != null ? Number(data.price) : undefined,
      stock: data.stock != null ? Number(data.stock) : undefined,
      rating: data.rating != null ? Number(data.rating) : undefined,
      updatedAt: new Date(),
    },
  }
  // Remove undefined fields
  Object.keys(update.$set).forEach((k) => update.$set[k] === undefined && delete update.$set[k])

  await db.collection('products').updateOne({ _id }, update)
  const updated = await db.collection('products').findOne({ _id })
  return { data: updated }
}

async function deleteProduct(id) {
  const db = getDb()
  const _id = typeof id === 'string' ? new ObjectId(id) : id
  const result = await db.collection('products').deleteOne({ _id })
  return { deletedCount: result.deletedCount }
}

module.exports = {
  getProducts,
  getProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
}
