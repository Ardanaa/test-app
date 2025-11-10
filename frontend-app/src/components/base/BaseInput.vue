<template>
  <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
    <span>
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </span>

    <component
      :is="componentTag"
      v-bind="inputAttrs"
      :class="[
        'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200',
        multiline ? 'min-h-[120px]' : 'h-11',
      ]"
      :value="modelValue"
      @input="onInput"
      @change="onInput"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </component>

    <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Option = { label: string; value: string | number }

type InputType = 'text' | 'number' | 'email' | 'password'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    label: string
    type?: InputType
    placeholder?: string
    required?: boolean
    hint?: string
    error?: string
    multiline?: boolean
    options?: Option[]
  }>(),
  {
    type: 'text',
    placeholder: '',
    required: false,
    hint: '',
    error: '',
    multiline: false,
    options: () => [],
  },
)

const emits = defineEmits<{
  'update:modelValue': [string | number]
}>()

const componentTag = computed(() => {
  if (props.options.length) return 'select'
  if (props.multiline) return 'textarea'
  return 'input'
})

const inputAttrs = computed(() => ({
  type: props.type,
  placeholder: props.placeholder,
  required: props.required,
  rows: props.multiline ? 4 : undefined,
}))

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emits('update:modelValue', value)
}
</script>
