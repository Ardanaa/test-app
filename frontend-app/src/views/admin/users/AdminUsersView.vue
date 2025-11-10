<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-widest text-brand-500">Admin</p>
        <h1 class="text-2xl font-bold text-slate-900">Manage users</h1>
      </div>
      <BaseButton @click="router.push({ name: 'admin-user-create' })">New user</BaseButton>
    </header>

    <StateBlock v-if="loading" state="loading" title="Loading users" description="Please wait" />
    <StateBlock v-else-if="error" state="error" title="Failed to fetch" :description="error" />
    <StateBlock
      v-else-if="!users.length"
      title="No users"
      description="Create a user to get started."
    />

    <div v-else class="overflow-hidden rounded-2xl border border-slate-100">
      <table class="min-w-full divide-y divide-slate-100 text-sm">
        <thead class="bg-slate-50 text-left font-semibold text-slate-500">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Username</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Phone</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 font-semibold text-slate-900">
              {{ user.name.firstname }} {{ user.name.lastname }}
            </td>
            <td class="px-4 py-3 text-slate-500">{{ user.username }}</td>
            <td class="px-4 py-3 text-slate-500">{{ user.email }}</td>
            <td class="px-4 py-3 text-slate-500">{{ user.phone }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <BaseButton variant="secondary" @click="router.push({ name: 'admin-user-edit', params: { id: user.id } })">
                  Edit
                </BaseButton>
                <BaseButton variant="danger" :loading="deletingId === user.id" @click="onDelete(user.id)">
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
import { deleteUser, fetchUsers } from '@/api/fakeStore'
import { useConfirm } from '@/composables/useConfirm'
import type { User } from '@/types'

const router = useRouter()
const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const { open: confirm } = useConfirm()

const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await fetchUsers()
    users.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load users.'
  } finally {
    loading.value = false
  }
}

const onDelete = async (id: number) => {
  const ok = await confirm({ message: 'Delete this user?', confirmText: 'Delete', cancelText: 'Cancel' })
  if (!ok) return
  deletingId.value = id
  try {
    await deleteUser(id)
    users.value = users.value.filter((user) => user.id !== id)
  } catch (err) {
    console.error(err)
    error.value = 'Unable to delete user.'
  } finally {
    deletingId.value = null
  }
}

onMounted(loadUsers)
</script>
