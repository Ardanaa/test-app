import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { createCart } from '@/api/fakeStore'
import type { CartPayload, Product } from '@/types'

interface CartLine {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartLine[]>([])
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const error = ref<string | null>(null)
  const lastOrderId = ref<number | null>(null)

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  const addToCart = (product: Product) => {
    const existing = items.value.find((entry) => entry.product.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((entry) => entry.product.id !== productId)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const safeQuantity = Math.max(1, quantity)
    const entry = items.value.find((item) => item.product.id === productId)

    if (entry) {
      entry.quantity = safeQuantity
    }
  }

  const resetCart = () => {
    items.value = []
    lastOrderId.value = null
    status.value = 'idle'
    error.value = null
  }

  const checkout = async (userId: number) => {
    if (!items.value.length) {
      error.value = 'Please add at least one product before checking out.'
      status.value = 'error'
      return
    }

    status.value = 'loading'
    error.value = null

    const payload: CartPayload = {
      userId,
      date: new Date().toISOString(),
      products: items.value.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
    }

    try {
      const { data } = await createCart(payload)
      lastOrderId.value = data.id
      status.value = 'success'
      items.value = []
    } catch (checkoutError) {
      console.error(checkoutError)
      status.value = 'error'
      error.value = 'Checkout failed. Please try again.'
    }
  }

  return {
    items,
    status,
    error,
    lastOrderId,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    resetCart,
  }
})
