import axios from 'axios'
import { Cart, Product, QueryMetric, Session, User } from '@/types'

// API base URL - defaults to localhost:5000 for backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// GET Products with pagination
export const getProducts = async (page = 1, limit = 100) => {
  const response = await api.get('/products', { params: { page, limit } })
  return response.data.data
}

// GET Product stats
export const getProductStats = async () => {
  const response = await api.get('/products/stats')
  return response.data.data
}

// GET Users with pagination
export const getUsers = async (page = 1, limit = 100) => {
  const response = await api.get('/users', { params: { page, limit } })
  return response.data.data
}

// GET Carts with optional status filter
export const getCarts = async (page = 1, limit = 100, status?: string) => {
  const response = await api.get('/carts', { params: { page, limit, status } })
  return response.data.data
}

// GET Cart stats
export const getCartStats = async () => {
  const response = await api.get('/carts/stats')
  return response.data.data
}

// GET Sessions with optional status filter
export const getSessions = async (page = 1, limit = 100, status?: string) => {
  const response = await api.get('/sessions', { params: { page, limit, status } })
  return response.data.data
}

// GET Session stats
export const getSessionStats = async () => {
  const response = await api.get('/sessions/stats')
  return response.data.data
}

// GET Dashboard metrics
export const getMetrics = async () => {
  const response = await api.get('/metrics')
  return response.data.data
}

// GET API health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.status === 200
  } catch {
    return false
  }
}

// GET Query metrics from backend query performance service
export const getQueries = async (collection?: string) => {
  const params = collection ? { collection } : undefined
  const response = await api.get('/query-performance', { params })
  return response.data.data
}

// CRUD for products
export const createProduct = async (payload: Partial<Product>) => {
  const response = await api.post('/products', payload)
  return response.data.data
}

export const updateProduct = async (id: string, payload: Partial<Product>) => {
  const response = await api.put(`/products/${id}`, payload)
  return response.data.data
}

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}
