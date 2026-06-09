export interface Product {
  _id?: string
  productId?: string
  name: string
  category: string
  brand?: string
  price: number
  stock: number
  rating: number
  createdAt?: string
}

export interface User {
  _id?: string
  userId?: string
  name: string
  email: string
  phone?: string
  createdAt?: string
}

export interface Cart {
  _id?: string
  userId: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    subtotal: number
  }>
  totalAmount: number
  status: 'active' | 'abandoned'
  createdAt: string
  updatedAt: string
}

export interface Session {
  _id?: string
  sessionId?: string
  userId: string
  ipAddress?: string
  device?: string
  status: 'active' | 'expired'
  createdAt: string
  expiresAt: string
}

export interface QueryMetric {
  id: string
  name: string
  executionTime: number
  docsExamined: number
  keysExamined: number
  usedIndex: boolean
  objective?: string
  query?: string
  indexName?: string
  gainPercentage?: number
  baselineExecutionTime?: number | null
  baselineDocsExamined?: number | null
  baselineKeysExamined?: number | null
  baselineUsedIndex?: boolean | null
  resultSample?: Array<Record<string, unknown>>
  resultFields?: string[]
}
