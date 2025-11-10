<template>
  <section>
    <StateBlock v-if="loading" state="loading" title="Loading product" description="Fetching data" />
    <StateBlock v-else-if="error" state="error" title="Oops" :description="error" />
    <StateBlock v-else-if="!product" title="Product missing" description="We could not find this product." />

    <div v-else class="grid gap-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:grid-cols-2">
      <img :src="product.image" :alt="product.title" class="mx-auto max-h-80 object-contain" />
      <div class="space-y-4">
        <div>
          <p class="text-sm uppercase tracking-wide text-slate-500">{{ product.category }}</p>
          <h1 class="text-3xl font-bold text-slate-900">{{ product.title }}</h1>
        </div>
        <p class="text-slate-600">{{ product.description }}</p>
        <p class="text-3xl font-semibold">{{ formatter.format(product.price) }}</p>
        <div class="flex items-center gap-3 text-sm text-slate-500">
          <span class="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
            ⭐ {{ product.rating?.rate ?? 'N/A' }}
          </span>
          <span>{{ product.rating?.count ?? 0 }} reviews</span>
        </div>
        <BaseButton class="w-full sm:w-auto" @click="cartStore.addToCart(product)">
          Add to cart
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import StateBlock from '@/components/shared/StateBlock.vue'
import { fetchProduct } from '@/api/fakeStore'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

const route = useRoute()
const cartStore = useCartStore()
const product = ref<Product | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const loadProduct = async (id: number) => {
  loading.value = true
  error.value = null
  product.value = null
  try {
    const { data } = await fetchProduct(id)
    product.value = data
  } catch (err) {
    console.error(err)
    error.value = 'This product could not be loaded.'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id) loadProduct(Number(id))
  },
  { immediate: true },
)
</script>
