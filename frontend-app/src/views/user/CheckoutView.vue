<template>
  <section class="space-y-6">
    <header>
      <p class="text-sm uppercase tracking-widest text-brand-500">Checkout</p>
      <h1 class="text-2xl font-bold text-slate-900">Shipping details</h1>
    </header>

    <StateBlock
      v-if="!items.length"
      title="Nothing to checkout"
      description="Add products to your cart first."
    />

    <div v-else class="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <BaseInput v-model="form.fullName" label="Full name" required />
        <BaseInput v-model="form.email" label="Email" type="email" required />
        <BaseInput v-model="form.address" label="Address" required />
        <div class="grid gap-4 sm:grid-cols-3">
          <BaseInput v-model="form.city" label="City" required />
          <BaseInput v-model="form.state" label="State" required />
          <BaseInput v-model="form.zip" label="ZIP" required />
        </div>
        <BaseButton type="submit" :loading="isSubmitting" class="w-full sm:w-auto">Place order</BaseButton>
        <p v-if="cartStore.error" class="text-sm text-red-500">{{ cartStore.error }}</p>
        <p v-if="cartStore.status === 'success'" class="text-sm text-green-600">
          Order #{{ cartStore.lastOrderId }} confirmed!
        </p>
      </form>

      <div class="space-y-4">
        <BaseCard class="space-y-4">
          <h2 class="text-lg font-semibold">Summary</h2>
          <ul class="space-y-2 text-sm">
            <li v-for="item in items" :key="item.product.id" class="flex justify-between">
              <span>{{ item.product.title }} × {{ item.quantity }}</span>
              <span>{{ formatter.format(item.product.price * item.quantity) }}</span>
            </li>
          </ul>
          <div class="border-t border-slate-100 pt-4">
            <p class="text-sm text-slate-500">Total</p>
            <p class="text-2xl font-bold">{{ formatter.format(totalPrice) }}</p>
          </div>
        </BaseCard>

        <BaseCard class="space-y-3">
          <h2 class="text-lg font-semibold">Previous carts</h2>
          <p class="text-sm text-slate-500">Data fetched from the Fake Store API.</p>

          <StateBlock
            v-if="cartsLoading"
            state="loading"
            title="Loading carts"
            description="Fetching history"
          />
          <StateBlock
            v-else-if="cartsError"
            state="error"
            title="Unable to load history"
            :description="cartsError"
          />
          <StateBlock
            v-else-if="!previousCarts.length"
            title="No records"
            description="No carts found for this user yet."
          />

          <ul v-else class="space-y-2 text-sm">
            <li v-for="cart in previousCarts" :key="cart.id" class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Cart #{{ cart.id }}</span>
              <span class="text-slate-500">{{ new Date(cart.date).toLocaleDateString() }}</span>
            </li>
          </ul>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import StateBlock from '@/components/shared/StateBlock.vue'
import { fetchCartsForUser } from '@/api/fakeStore'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { Cart } from '@/types'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { items, totalPrice } = storeToRefs(cartStore)

const form = reactive({
  fullName: `${authStore.user?.name.firstname ?? ''} ${authStore.user?.name.lastname ?? ''}`.trim(),
  email: authStore.user?.email ?? '',
  address: authStore.user?.address.street ?? '',
  city: authStore.user?.address.city ?? '',
  state: '',
  zip: authStore.user?.address.zipcode ?? '',
})

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const isSubmitting = computed(() => cartStore.status === 'loading')

const previousCarts = ref<Cart[]>([])
const cartsLoading = ref(false)
const cartsError = ref<string | null>(null)

const loadCarts = async () => {
  if (!authStore.user) return
  cartsLoading.value = true
  cartsError.value = null
  try {
    const { data } = await fetchCartsForUser(authStore.user.id)
    previousCarts.value = data
  } catch (err) {
    console.error(err)
    cartsError.value = 'Failed to fetch carts.'
  } finally {
    cartsLoading.value = false
  }
}

const onSubmit = async () => {
  await cartStore.checkout(authStore.user?.id ?? 1)
}

onMounted(loadCarts)
</script>
