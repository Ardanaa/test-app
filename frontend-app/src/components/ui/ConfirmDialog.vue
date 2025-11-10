<template>
  <v-dialog v-model="state.isOpen" max-width="480" persistent>
    <v-card rounded="xl">
      <v-card-title class="text-wrap">{{ state.title }}</v-card-title>
      <v-card-text>{{ state.message }}</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="onCancel">{{ state.cancelText }}</v-btn>
        <v-btn color="error" @click="onConfirm">{{ state.confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { confirmState as state, useConfirm } from '@/composables/useConfirm'

const { resolve } = useConfirm()

const onCancel = () => resolve(false)
const onConfirm = () => resolve(true)
</script>


