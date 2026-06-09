const { getDb } = require('../db')

async function getCarts({ page = 1, limit = 20, status }) {
  const db = getDb()
  const skip = (page - 1) * limit
  const filter = status ? { status } : {}

  const carts = await db
    .collection('carts')
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection('carts').countDocuments(filter)

  return {
    data: carts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

async function getCartStats() {
  const db = getDb()

  const stats = await db
    .collection('carts')
    .aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          avgAmount: { $avg: '$totalAmount' },
        },
      },
    ])
    .toArray()

  return { data: stats }
}

module.exports = {
  getCarts,
  getCartStats,
}
