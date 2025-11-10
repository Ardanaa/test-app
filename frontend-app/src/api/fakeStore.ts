import apiClient from './client'
import type {
  Cart,
  CartPayload,
  Product,
  ProductPayload,
  User,
  UserPayload,
  LoginPayload,
} from '@/types'

export const loginRequest = (payload: LoginPayload) =>
  apiClient.post<{ token: string }>('/auth/login', payload)

export const fetchProducts = () => apiClient.get<Product[]>('/products')
export const fetchProduct = (id: number) => apiClient.get<Product>(`/products/${id}`)
export const createProduct = (payload: ProductPayload) => apiClient.post<Product>('/products', payload)
export const updateProduct = (id: number, payload: ProductPayload) =>
  apiClient.put<Product>(`/products/${id}`, payload)
export const deleteProduct = (id: number) => apiClient.delete(`/products/${id}`)

export const fetchUsers = () => apiClient.get<User[]>('/users')
export const fetchUser = (id: number) => apiClient.get<User>(`/users/${id}`)
export const createUser = (payload: UserPayload) => apiClient.post<User>('/users', payload)
export const updateUser = (id: number, payload: UserPayload) => apiClient.put<User>(`/users/${id}`, payload)
export const deleteUser = (id: number) => apiClient.delete(`/users/${id}`)

export const fetchCartsForUser = (userId: number) => apiClient.get<Cart[]>(`/carts/user/${userId}`)
export const createCart = (payload: CartPayload) => apiClient.post<Cart>('/carts', payload)
