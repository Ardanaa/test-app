<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader v-if="!route.meta?.hideShell" />

    <main class="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <ConfirmDialog />
    <AppFooter v-if="!route.meta?.hideShell" />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { onMounted, onErrorCaptured } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  authStore.hydrate()
})

onErrorCaptured((err, instance, info) => {
  // Centralized unexpected error logging
  // eslint-disable-next-line no-console
  console.error('Unexpected error:', err, info)
  return false
})
</script>
