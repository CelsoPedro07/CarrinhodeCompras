const express = require('express')
const {
  getProducts,
  getProductStats,
} = require('../services/productsService')
const { getUsers } = require('../services/usersService')
const { getCarts, getCartStats } = require('../services/cartsService')
const { getSessions, getSessionStats } = require('../services/sessionsService')
const { getMetrics } = require('../services/metricsService')
const { getQueryPerformance } = require('../services/queryPerformanceService')

const router = express.Router()

router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const result = await getProducts({ page, limit })
    res.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

router.get('/products/stats', async (req, res) => {
  try {
    const result = await getProductStats()
    res.json(result)
  } catch (error) {
    console.error('Error fetching product stats:', error)
    res.status(500).json({ error: 'Failed to fetch product stats' })
  }
})

router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const result = await getUsers({ page, limit })
    res.json(result)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/carts', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const status = req.query.status
    const result = await getCarts({ page, limit, status })
    res.json(result)
  } catch (error) {
    console.error('Error fetching carts:', error)
    res.status(500).json({ error: 'Failed to fetch carts' })
  }
})

router.get('/carts/stats', async (req, res) => {
  try {
    const result = await getCartStats()
    res.json(result)
  } catch (error) {
    console.error('Error fetching cart stats:', error)
    res.status(500).json({ error: 'Failed to fetch cart stats' })
  }
})

router.get('/sessions', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 20
    const status = req.query.status
    const result = await getSessions({ page, limit, status })
    res.json(result)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

router.get('/sessions/stats', async (req, res) => {
  try {
    const result = await getSessionStats()
    res.json(result)
  } catch (error) {
    console.error('Error fetching session stats:', error)
    res.status(500).json({ error: 'Failed to fetch session stats' })
  }
})

router.get('/metrics', async (req, res) => {
  try {
    const result = await getMetrics()
    res.json(result)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    res.status(500).json({ error: 'Failed to fetch metrics' })
  }
})

router.get('/query-performance', async (req, res) => {
  try {
    const result = await getQueryPerformance()
    res.json(result)
  } catch (error) {
    console.error('Error fetching query performance:', error)
    res.status(500).json({ error: 'Failed to fetch query performance' })
  }
})

module.exports = router
