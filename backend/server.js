const express = require('express')
const cors = require('cors')
const { connectDB, closeDB } = require('./db')
const apiRoutes = require('./routes/apiRoutes')

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api', apiRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
async function start() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`)
    console.log(`📊 API endpoints:`)
    console.log(`   GET /api/products`)
    console.log(`   GET /api/products/stats`)
    console.log(`   GET /api/users`)
    console.log(`   GET /api/carts`)
    console.log(`   GET /api/carts/stats`)
    console.log(`   GET /api/sessions`)
    console.log(`   GET /api/sessions/stats`)
    console.log(`   GET /api/metrics`)
    console.log(`   GET /api/query-performance`)
    console.log(`   GET /api/health\n`)
  })
}

start().catch(console.error)

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down...')
  await closeDB()
  process.exit(0)
})
