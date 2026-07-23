<script setup lang="ts">
import { reactive, watch } from 'vue'
import Modal from '@/presentation/components/common/Modal.vue'
import type { Brand } from '@/domain/entities/Brand'

const props = defineProps<{
  open: boolean
  editing: Brand | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [name: string]
}>()

const form = reactive({ name: '' })

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) form.name = props.editing?.name ?? ''
  },
)

function handleSubmit() {
  if (!form.name.trim()) return
  emit('submit', form.name.trim())
}
</script>

<template>
  <Modal
    :open="open"
    :title="editing ? 'Edit Brand' : 'Tambah Brand'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="field-label" for="brand-name">Nama Brand</label>
        <input
          id="brand-name"
          v-model="form.name"
          class="field-input"
          type="text"
          placeholder="mis. Dell, Logitech, Xiaomi"
          autofocus
        />
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="emit('close')">
          Batal
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting || !form.name.trim()"
        >
          {{ submitting ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped>
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
</style>
