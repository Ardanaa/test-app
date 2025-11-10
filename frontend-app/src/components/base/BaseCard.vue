<template>
  <v-card :elevation="interactive ? 2 : 1" rounded="xl" :class="[paddingClass, interactiveClass]">
    <slot />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Padding = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  interactive?: boolean
  padding?: Padding
}>(), {
  interactive: false,
  padding: 'md',
})

const paddingClass = computed(() => {
  switch (props.padding) {
    case 'sm':
      return 'p-4'
    case 'lg':
      return 'p-8'
    default:
      return 'p-6'
  }
})

const interactiveClass = computed(() => (props.interactive ? 'cursor-pointer transition-transform hover:-translate-y-0.5' : ''))
</script>
