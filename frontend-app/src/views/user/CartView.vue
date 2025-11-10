<template>
  <section class="space-y-6">
    <header>
      <p class="text-sm uppercase tracking-widest text-brand-500">Cart</p>
      <h1 class="text-2xl font-bold text-slate-900">Your selected items</h1>
    </header>

    <StateBlock
      v-if="!items.length"
      title="Cart is empty"
      description="Add some products to get started."
    />

    <div v-else class="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div class="space-y-4">
        <article
          v-for="item in items"
          :key="item.product.id"
          class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row"
        >
          <img :src="item.product.image" :alt="item.product.title" class="h-28 w-28 object-contain" />
          <div class="flex-1 space-y-2">
            <RouterLink
              :to="{ name: 'product-detail', params: { id: item.product.id } }"
              class="text-lg font-semibold text-slate-900"
            >
              {{ item.product.title }}
            </RouterLink>
            <p class="text-sm text-slate-500">{{ item.product.description }}</p>
            <p class="font-semibold">{{ formatter.format(item.product.price) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              :value="item.quantity"
              type="number"
              min="1"
              class="h-11 w-20 rounded-xl border border-slate-200 text-center"
              @change="onQuantityInput($event, item.product.id)"
            />
            <BaseButton variant="ghost" @click="cartStore.removeFromCart(item.product.id)">Remove</BaseButton>
          </div>
        </article>
      </div>

      <BaseCard class="space-y-4">
        <div>
          <p class="text-sm text-slate-500">Items</p>
          <p class="text-3xl font-bold">{{ totalItems }} pcs</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">Estimated total</p>
          <p class="text-3xl font-bold">{{ formatter.format(totalPrice) }}</p>
        </div>
        <BaseButton class="w-full" :disabled="!items.length" @click="goToCheckout">Proceed to checkout</BaseButton>
      </BaseCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import StateBlock from '@/components/shared/StateBlock.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const router = useRouter()
const { items, totalItems, totalPrice } = storeToRefs(cartStore)

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const onQuantityInput = (event: Event, productId: number) => {
  const value = Number((event.target as HTMLInputElement).value)
  cartStore.updateQuantity(productId, value)
}

const goToCheckout = () => {
  router.push({ name: 'checkout' })
}
</script>
