<template>
  <div class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center">
    <div class="text-3xl">{{ emoji }}</div>
    <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
    <p class="max-w-md text-sm text-slate-500">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    state?: 'empty' | 'error' | 'loading'
  }>(),
  {
    state: 'empty',
  },
)

const emoji = computed(() => {
  if (props.state === 'loading') return '⏳'
  if (props.state === 'error') return '⚠️'
  return '📭'
})
</script>
