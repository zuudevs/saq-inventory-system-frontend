<script setup lang="ts">
import { computed } from 'vue'
import type { MetadataField } from '@/domain/entities/MetadataStructure'

const props = defineProps<{
  field: MetadataField
  modelValue: unknown
}>()

const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()

const inputType = computed(() => {
  switch (props.field.type) {
    case 'int':
    case 'float':
      return 'number'
    case 'date':
      return 'date'
    case 'datetime':
      return 'datetime-local'
    default:
      return 'text'
  }
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.field.type === 'int') {
    emit('update:modelValue', target.value === '' ? undefined : parseInt(target.value, 10))
  } else if (props.field.type === 'float') {
    emit('update:modelValue', target.value === '' ? undefined : parseFloat(target.value))
  } else {
    emit('update:modelValue', target.value)
  }
}

function onSelect(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="field">
    <label class="field-label">
      {{ field.label }}
      <span v-if="!field.nullable" class="required">*</span>
    </label>

    <select
      v-if="field.type === 'enum'"
      class="field-select"
      :value="modelValue ?? ''"
      :required="!field.nullable"
      @change="onSelect"
    >
      <option value="" disabled>Pilih {{ field.label }}</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>

    <select
      v-else-if="field.type === 'bool'"
      class="field-select"
      :value="modelValue === true ? 'true' : modelValue === false ? 'false' : ''"
      @change="
        emit(
          'update:modelValue',
          ($event.target as HTMLSelectElement).value === 'true',
        )
      "
    >
      <option value="" disabled>Pilih {{ field.label }}</option>
      <option value="true">Ya</option>
      <option value="false">Tidak</option>
    </select>

    <textarea
      v-else-if="field.type === 'text'"
      class="field-textarea"
      :value="(modelValue as string) ?? ''"
      :required="!field.nullable"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <input
      v-else
      class="field-input"
      :type="inputType"
      :value="modelValue ?? ''"
      :required="!field.nullable"
      :maxlength="field.length"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.required {
  color: var(--color-danger-600);
}
</style>
