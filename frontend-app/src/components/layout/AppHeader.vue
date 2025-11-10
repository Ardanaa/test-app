<template>
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <RouterLink to="/products" class="text-xl font-semibold text-brand-600">
        FakeStore Admin
      </RouterLink>

      <nav class="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-3 py-1.5 transition hover:bg-slate-100"
          :class="isActive(link.to) ? 'bg-brand-50 text-brand-700' : ''"
        >
          {{ link.label }}
          <span v-if="link.badge" class="ml-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
            {{ link.badge }}
          </span>
        </RouterLink>

        <RouterLink
          v-if="authStore.role === 'admin'"
          to="/admin/products"
          class="rounded-full px-3 py-1.5 transition hover:bg-slate-100"
          :class="isActive('/admin') ? 'bg-brand-50 text-brand-700' : ''"
        >
          Admin
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3 text-sm">
        <div class="hidden text-right sm:block">
          <p class="font-semibold text-slate-800">{{ greeting }}</p>
          <p class="text-xs uppercase tracking-widest text-slate-500">{{ authStore.role }}</p>
        </div>

        <BaseButton variant="ghost" @click="onLogout">Sign out</BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { totalItems } = storeToRefs(cartStore)

const navLinks = computed(() => [
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart', badge: totalItems.value || undefined },
  { label: 'Checkout', to: '/checkout' },
])

const isActive = (target: string) => route.path.startsWith(target)

const greeting = computed(() => {
  if (!authStore.user) return 'Guest'
  return `${authStore.user.name.firstname} ${authStore.user.name.lastname}`
})

const onLogout = () => {
  authStore.logout()
  cartStore.resetCart()
  router.push({ name: 'login' })
}
</script>
