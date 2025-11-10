<template>
  <StateBlock title="Page not found" description="The page you are looking for does not exist." state="error">
    <RouterLink to="/products" class="text-sm font-semibold text-brand-600">Back to dashboard</RouterLink>
  </StateBlock>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StateBlock from '@/components/shared/StateBlock.vue'
</script>
