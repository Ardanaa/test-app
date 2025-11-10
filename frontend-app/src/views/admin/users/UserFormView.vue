<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-widest text-brand-500">Admin · Users</p>
        <h1 class="text-2xl font-bold text-slate-900">{{ isEdit ? 'Edit user' : 'Create user' }}</h1>
      </div>
      <BaseButton variant="secondary" @click="router.back()">Back</BaseButton>
    </header>

    <StateBlock v-if="loading" state="loading" title="Preparing form" description="Fetching user" />

    <BaseCard v-else>
      <form class="grid gap-4" @submit.prevent="onSubmit">
        <BaseInput v-model="form.name.firstname" label="First name" required />
        <BaseInput v-model="form.name.lastname" label="Last name" required />
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.email" label="Email" type="email" required />
          <BaseInput v-model="form.username" label="Username" required />
        </div>
        <BaseInput v-model="form.password" label="Password" type="password" required />
        <BaseInput v-model="form.phone" label="Phone" required />
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.address.street" label="Street" required />
          <BaseInput v-model.number="form.address.number" label="Number" type="number" required />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.address.city" label="City" required />
          <BaseInput v-model="form.address.zipcode" label="ZIP" required />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.address.geolocation.lat" label="Latitude" />
          <BaseInput v-model="form.address.geolocation.long" label="Longitude" />
        </div>
        <div class="flex gap-3">
          <BaseButton type="submit" :loading="saving">
            {{ isEdit ? 'Update user' : 'Create user' }}
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
import { createUser, fetchUser, updateUser } from '@/api/fakeStore'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  email: '',
  username: '',
  password: 'm38rmF$',
  phone: '',
  name: { firstname: '', lastname: '' },
  address: {
    city: '',
    street: '',
    number: 0,
    zipcode: '',
    geolocation: { lat: '0', long: '0' },
  },
})

const isEdit = computed(() => Boolean(route.params.id))

const loadUser = async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const { data } = await fetchUser(Number(route.params.id))
    form.email = data.email
    form.username = data.username
    form.password = data.password
    form.phone = data.phone
    form.name.firstname = data.name.firstname
    form.name.lastname = data.name.lastname
    form.address.city = data.address.city
    form.address.street = data.address.street
    form.address.number = data.address.number
    form.address.zipcode = data.address.zipcode
    form.address.geolocation.lat = data.address.geolocation.lat
    form.address.geolocation.long = data.address.geolocation.long
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load user.'
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  saving.value = true
  error.value = null
  try {
    if (isEdit.value) {
      await updateUser(Number(route.params.id), form)
    } else {
      await createUser(form)
    }
    router.push({ name: 'admin-users' })
  } catch (err) {
    console.error(err)
    error.value = 'Unable to save user.'
  } finally {
    saving.value = false
  }
}

onMounted(loadUser)
</script>
