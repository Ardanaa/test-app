import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import pinia from '@/stores'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/LoginView.vue'),
    meta: { guestOnly: true, hideShell: true },
  },
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/user/ProductsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/user/ProductDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/user/CartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/user/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    redirect: '/admin/products',
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('@/views/admin/products/AdminProductsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/products/new',
    name: 'admin-product-create',
    component: () => import('@/views/admin/products/ProductFormView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/products/:id/edit',
    name: 'admin-product-edit',
    component: () => import('@/views/admin/products/ProductFormView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/admin/users/AdminUsersView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users/new',
    name: 'admin-user-create',
    component: () => import('@/views/admin/users/UserFormView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users/:id/edit',
    name: 'admin-user-edit',
    component: () => import('@/views/admin/users/UserFormView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/public/NotFoundView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore(pinia)
  authStore.hydrate()

  if (to.meta?.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  const requiredRoles = to.meta?.roles as string[] | undefined

  if (requiredRoles && !requiredRoles.includes(authStore.role)) {
    next({ name: 'products' })
    return
  }

  if (to.meta?.guestOnly && authStore.isAuthenticated) {
    next({ name: 'products' })
    return
  }

  next()
})

export default router
