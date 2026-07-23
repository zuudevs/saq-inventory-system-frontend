<script setup lang="ts">
import { reactive, watch } from 'vue'
import Modal from '@/presentation/components/common/Modal.vue'
import type { Location } from '@/domain/entities/Location'

const props = defineProps<{
  open: boolean
  editing: Location | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: { name: string; roomCode?: string; description?: string }]
}>()

const form = reactive({ name: '', roomCode: '', description: '' })

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = props.editing?.name ?? ''
      form.roomCode = props.editing?.roomCode ?? ''
      form.description = props.editing?.description ?? ''
    }
  },
)

function handleSubmit() {
  if (!form.name.trim()) return
  emit('submit', {
    name: form.name.trim(),
    roomCode: form.roomCode.trim() || undefined,
    description: form.description.trim() || undefined,
  })
}
</script>

<template>
  <Modal
    :open="open"
    :title="editing ? 'Edit Lokasi' : 'Tambah Lokasi'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label class="field-label" for="location-name">Nama Lokasi</label>
        <input
          id="location-name"
          v-model="form.name"
          class="field-input"
          type="text"
          placeholder="mis. Ruang Server, Gudang Lantai 2"
          autofocus
        />
      </div>

      <div class="field">
        <label class="field-label" for="location-room">Kode Ruangan (opsional)</label>
        <input
          id="location-room"
          v-model="form.roomCode"
          class="field-input"
          type="text"
          placeholder="mis. B2-04"
        />
      </div>

      <div class="field">
        <label class="field-label" for="location-desc">Deskripsi (opsional)</label>
        <textarea
          id="location-desc"
          v-model="form.description"
          class="field-textarea"
          placeholder="Deskripsi singkat lokasi ini"
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
