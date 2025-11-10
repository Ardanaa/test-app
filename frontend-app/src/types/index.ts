export type Role = 'admin' | 'user'

export interface Rating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: Rating
}

export type ProductPayload = Pick<Product, 'title' | 'price' | 'description' | 'category' | 'image'>

export interface Name {
  firstname: string
  lastname: string
}

export interface Address {
  city: string
  street: string
  number: number
  zipcode: string
  geolocation: {
    lat: string
    long: string
  }
}

export interface User {
  id: number
  email: string
  username: string
  password: string
  name: Name
  phone: string
  address: Address
}

export type UserPayload = Pick<User, 'email' | 'username' | 'password' | 'phone'> & {
  name: Name
  address: Address
}

export interface CartProduct {
  productId: number
  quantity: number
}

export interface Cart {
  id: number
  userId: number
  date: string
  products: CartProduct[]
}

export interface CartPayload {
  userId: number
  date: string
  products: CartProduct[]
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}
