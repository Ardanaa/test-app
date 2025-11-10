<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-widest text-brand-500">Admin</p>
        <h1 class="text-2xl font-bold text-slate-900">Manage products</h1>
      </div>
      <BaseButton @click="router.push({ name: 'admin-product-create' })">New product</BaseButton>
    </header>

    <StateBlock v-if="loading" state="loading" title="Loading products" description="Please wait" />
    <StateBlock v-else-if="error" state="error" title="Failed to fetch" :description="error" />
    <StateBlock
      v-else-if="!products.length"
      title="No products"
      description="Start by creating the first product."
    />

    <div v-else class="overflow-hidden rounded-2xl border border-slate-100">
      <table class="min-w-full divide-y divide-slate-100">
        <thead class="bg-slate-50 text-left text-sm font-semibold text-slate-500">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Price</th>
            <th class="px-4 py-3">Rating</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white text-sm">
          <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-900">{{ product.title }}</td>
            <td class="px-4 py-3 text-slate-500">{{ product.category }}</td>
            <td class="px-4 py-3 font-semibold">{{ formatter.format(product.price) }}</td>
            <td class="px-4 py-3 text-slate-500">{{ product.rating?.rate ?? 'N/A' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <BaseButton variant="secondary" @click="router.push({ name: 'admin-product-edit', params: { id: product.id } })">
                  Edit
                </BaseButton>
                <BaseButton variant="danger" :loading="deletingId === product.id" @click="onDelete(product.id)">
                  Delete
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import StateBlock from '@/components/shared/StateBlock.vue'
import { deleteProduct, fetchProducts } from '@/api/fakeStore'
import { useConfirm } from '@/composables/useConfirm'
import type { Product } from '@/types'

const router = useRouter()
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const { open: confirm } = useConfirm()

const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await fetchProducts()
    products.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load products.'
  } finally {
    loading.value = false
  }
}

const onDelete = async (id: number) => {
  const ok = await confirm({ message: 'Delete this product?', confirmText: 'Delete', cancelText: 'Cancel' })
  if (!ok) return
  deletingId.value = id
  try {
    await deleteProduct(id)
    products.value = products.value.filter((product) => product.id !== id)
  } catch (err) {
    console.error(err)
    error.value = 'Failed to delete product.'
  } finally {
    deletingId.value = null
  }
}

onMounted(loadProducts)
</script>
