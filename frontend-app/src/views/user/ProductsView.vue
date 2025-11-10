<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-widest text-brand-500">Catalog</p>
        <h1 class="text-2xl font-bold text-slate-900">Browse products</h1>
      </div>
      <div class="flex flex-col gap-3 md:flex-row">
        <input
          v-model="filters.search"
          type="search"
          placeholder="Search products"
          class="h-11 min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 text-sm"
        />
        <select v-model="filters.category" class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm">
          <option value="all">All categories</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
    </header>

    <StateBlock v-if="loading" state="loading" title="Loading products" description="Please wait a moment" />
    <StateBlock
      v-else-if="error"
      state="error"
      title="Unable to fetch products"
      :description="error"
    />
    <StateBlock
      v-else-if="!filteredProducts.length"
      title="No products"
      description="Try adjusting your filters."
    />

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="product in filteredProducts"
        :key="product.id"
        class="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
      >
        <img :src="product.image" :alt="product.title" class="mx-auto h-40 object-contain" />
        <div class="mt-4 space-y-2">
          <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }" class="text-lg font-semibold">
            {{ product.title }}
          </RouterLink>
          <p class="text-sm text-slate-500 max-h-12 overflow-hidden">{{ product.description }}</p>
          <p class="text-lg font-bold text-slate-900">
            {{ formatter.format(product.price) }}
          </p>
        </div>
        <div class="mt-4 flex gap-2">
          <BaseButton class="flex-1" @click="cartStore.addToCart(product)">Add to cart</BaseButton>
          <BaseButton variant="secondary" @click="goToDetail(product.id)">Details</BaseButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import StateBlock from '@/components/shared/StateBlock.vue'
import { fetchProducts } from '@/api/fakeStore'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)
const error = ref<string | null>(null)
const products = ref<Product[]>([])

const filters = reactive({ search: '', category: 'all' })

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const categories = computed(() => [...new Set(products.value.map((product) => product.category))])

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchCategory = filters.category === 'all' || product.category === filters.category
    const matchSearch = product.title.toLowerCase().includes(filters.search.toLowerCase())
    return matchCategory && matchSearch
  })
})

const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await fetchProducts()
    products.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Please refresh the page to try again.'
  } finally {
    loading.value = false
  }
}

const goToDetail = (id: number) => {
  router.push({ name: 'product-detail', params: { id } })
}

onMounted(loadProducts)
</script>
