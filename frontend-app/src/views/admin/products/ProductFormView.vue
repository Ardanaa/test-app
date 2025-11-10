<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-widest text-brand-500">Admin · Products</p>
        <h1 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'Edit product' : 'Create product' }}
        </h1>
      </div>
      <BaseButton variant="secondary" @click="router.back()">Back</BaseButton>
    </header>

    <StateBlock v-if="loading" state="loading" title="Preparing form" description="Fetching product" />

    <BaseCard v-else>
      <form class="grid gap-4" @submit.prevent="onSubmit">
        <BaseInput v-model="form.title" label="Title" required />
        <BaseInput v-model="form.category" label="Category" required />
        <BaseInput v-model.number="form.price" label="Price" type="number" required />
        <BaseInput v-model="form.image" label="Image URL" required />
        <BaseInput v-model="form.description" label="Description" multiline />

        <div class="flex gap-3">
          <BaseButton type="submit" :loading="saving">
            {{ isEdit ? 'Update' : 'Create' }}
          </BaseButton>
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        </div>
      </form>
    </BaseCard>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import StateBlock from '@/components/shared/StateBlock.vue'
import { createProduct, fetchProduct, updateProduct } from '@/api/fakeStore'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const form = reactive({ title: '', price: 0, category: '', image: '', description: '' })

const isEdit = computed(() => Boolean(route.params.id))

const loadProduct = async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const { data } = await fetchProduct(Number(route.params.id))
    form.title = data.title
    form.price = data.price
    form.category = data.category
    form.image = data.image
    form.description = data.description
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load product details.'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = null
  try {
    if (isEdit.value) {
      await updateProduct(Number(route.params.id), form)
    } else {
      await createProduct(form)
    }
    router.push({ name: 'admin-products' })
  } catch (err) {
    console.error(err)
    error.value = 'Could not save product.'
  } finally {
    saving.value = false
  }
}

onMounted(loadProduct)
</script>
