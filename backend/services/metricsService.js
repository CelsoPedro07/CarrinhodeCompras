const { getDb } = require('../db')

async function getMetrics() {
  const db = getDb()

  const [productCount, userCount, cartCount, sessionCount, activeCarts, totalRevenueAggregation] = await Promise.all([
    db.collection('products').countDocuments(),
    db.collection('users').countDocuments(),
    db.collection('carts').countDocuments(),
    db.collection('sessions').countDocuments(),
    db.collection('carts').countDocuments({ status: 'active' }),
    db
      .collection('carts')
      .aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
      .toArray(),
  ])

  return {
    data: {
      totalProducts: productCount,
      totalUsers: userCount,
      totalCarts: cartCount,
      activeCarts,
      totalSessions: sessionCount,
      totalRevenue: totalRevenueAggregation[0]?.total || 0,
    },
  }
}

module.exports = {
  getMetrics,
}
