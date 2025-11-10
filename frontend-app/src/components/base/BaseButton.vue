<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      variantClasses,
      fullWidth ? 'w-full' : '',
      (disabled || loading) ? 'opacity-60' : '',
    ]"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const props = withDefaults(
  defineProps<{ variant?: Variant; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; loading?: boolean; fullWidth?: boolean }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600'
    case 'ghost':
      return 'bg-transparent text-slate-700 hover:bg-slate-100'
    default:
      return 'bg-brand-600 text-white hover:bg-brand-500 focus-visible:outline-brand-600'
  }
})
</script>
