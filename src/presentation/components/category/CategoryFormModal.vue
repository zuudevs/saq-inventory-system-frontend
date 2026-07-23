<script setup lang="ts">
import { reactive, watch } from 'vue'
import Modal from '@/presentation/components/common/Modal.vue'
import type { Category } from '@/domain/entities/Category'

const props = defineProps<{
  open: boolean
  editing: Category | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: { name: string; description?: string }]
}>()

const form = reactive({ name: '', description: '' })

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = props.editing?.name ?? ''
      form.description = props.editing?.description ?? ''
    }
  },
)

function handleSubmit() {
  if (!form.name.trim()) return
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
  })
}
</script>

<template>
  <Modal
    :open="open"
    :title="editing ? 'Edit Kategori' : 'Tambah Kategori'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="field-label" for="category-name">Nama Kategori</label>
        <input
          id="category-name"
          v-model="form.name"
          class="field-input"
          type="text"
          placeholder="mis. Laptop, Proyektor, Furnitur"
          autofocus
        />
      </div>

      <div class="field">
        <label class="field-label" for="category-desc">Deskripsi (opsional)</label>
        <textarea
          id="category-desc"
          v-model="form.description"
          class="field-textarea"
          placeholder="Deskripsi singkat kategori ini"
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
