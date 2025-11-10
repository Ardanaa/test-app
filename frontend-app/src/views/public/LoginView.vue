<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 py-8">
    <BaseCard class="w-full max-w-md">
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div class="space-y-1">
          <p class="text-sm font-semibold uppercase tracking-widest text-brand-500">Frontend Technical Test</p>
          <h1 class="text-2xl font-bold text-slate-900">Welcome back 👋</h1>
          <p class="text-sm text-slate-500">Use the provided credentials to explore admin & user journeys.</p>
        </div>

        <BaseInput v-model="form.username" label="Username" placeholder="johnd" required />
        <BaseInput v-model="form.password" label="Password" type="password" required />

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Choose a role</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="option in roleOptions"
              :key="option.value"
              type="button"
              class="rounded-2xl border px-4 py-3 text-sm font-semibold transition"
              :class="
                form.role === option.value
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600'
              "
              @click="form.role = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <BaseButton type="submit" :loading="authStore.loading" full-width>Login</BaseButton>
          <p v-if="authStore.error" class="text-sm text-red-500">{{ authStore.error }}</p>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { DEFAULT_CREDENTIALS } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  username: DEFAULT_CREDENTIALS.username,
  password: DEFAULT_CREDENTIALS.password,
  role: 'user' as Role,
})

const roleOptions = [
  { label: 'User journey', value: 'user' as Role },
  { label: 'Admin journey', value: 'admin' as Role },
]

const onSubmit = async () => {
  await authStore.login({ username: form.username, password: form.password }, form.role)

  if (authStore.error || !authStore.isAuthenticated) return

  const redirect = (route.query.redirect as string) ?? (form.role === 'admin' ? '/admin/products' : '/products')
  router.push(redirect)
}
</script>
