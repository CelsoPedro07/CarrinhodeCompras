const { getDb } = require('../db')

async function getUsers({ page = 1, limit = 20 }) {
  const db = getDb()
  const skip = (page - 1) * limit
  const users = await db
    .collection('users')
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray()

  const total = await db.collection('users').countDocuments()

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

module.exports = {
  getUsers,
}
