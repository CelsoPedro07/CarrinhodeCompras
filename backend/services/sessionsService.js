const { getDb } = require('../db')

async function getSessions({ page = 1, limit = 20, status }) {
  const db = getDb()
  const skip = (page - 1) * limit
  const filter = status ? { status } : {}

  const sessions = await db
    .collection('sessions')
    .find(filter)
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection('sessions').countDocuments(filter)

  return {
    data: sessions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

async function getSessionStats() {
  const db = getDb()

  const stats = await db
    .collection('sessions')
    .aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()

  return { data: stats }
}

module.exports = {
  getSessions,
  getSessionStats,
}
