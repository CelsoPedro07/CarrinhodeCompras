const { getDb } = require('../db')

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

module.exports = {
  getProducts,
  getProductStats,
}
