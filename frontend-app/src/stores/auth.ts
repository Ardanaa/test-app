import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loginRequest, fetchUsers } from '@/api/fakeStore'
import type { LoginPayload, Role, User } from '@/types'
import { ROLES, STORAGE_KEYS } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const role = ref<Role>(ROLES.user)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hydrated = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value))

  const persist = () => {
    if (typeof window === 'undefined') return
    if (token.value) {
      window.localStorage.setItem(STORAGE_KEYS.token, token.value)
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.token)
    }

    window.localStorage.setItem(STORAGE_KEYS.role, role.value)

    if (user.value) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user.value))
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user)
    }
  }

  const hydrate = () => {
    if (typeof window === 'undefined' || hydrated.value) return
    const storedToken = window.localStorage.getItem(STORAGE_KEYS.token)
    const storedRole = window.localStorage.getItem(STORAGE_KEYS.role) as Role | null
    const storedUser = window.localStorage.getItem(STORAGE_KEYS.user)

    token.value = storedToken
    role.value = storedRole ?? ROLES.user

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser) as User
      } catch (parseError) {
        console.error('Failed to parse stored user', parseError)
        window.localStorage.removeItem(STORAGE_KEYS.user)
      }
    }

    hydrated.value = true
  }

  const login = async (credentials: LoginPayload, selectedRole: Role) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await loginRequest(credentials)
      token.value = data.token
      role.value = selectedRole

      const usersResponse = await fetchUsers()
      user.value = usersResponse.data.find((candidate) => candidate.username === credentials.username) ?? null

      persist()
    } catch (loginError) {
      console.error(loginError)
      error.value = 'Unable to sign in. Please confirm your credentials.'
      token.value = null
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    role.value = ROLES.user
    error.value = null
    persist()
  }

  return {
    token,
    user,
    role,
    loading,
    error,
    hydrated,
    isAuthenticated,
    login,
    logout,
    hydrate,
  }
})
