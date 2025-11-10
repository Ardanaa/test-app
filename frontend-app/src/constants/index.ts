import type { Role } from '@/types'

export const API_BASE_URL = 'https://fakestoreapi.com'

export const ROLES: Record<Role, Role> = {
  admin: 'admin',
  user: 'user',
}

export const STORAGE_KEYS = {
  token: 'fta::token',
  role: 'fta::role',
  user: 'fta::user',
}

export const DEFAULT_CREDENTIALS = {
  username: 'johnd',
  password: 'm38rmF$',
}
