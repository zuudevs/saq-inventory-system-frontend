<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import Modal from '@/presentation/components/common/Modal.vue'
import { useMetadataStructureStore } from '@/presentation/stores/metadataStructure.store'
import { useToast } from '@/presentation/composables/useToast'
import { DomainError } from '@/domain/entities/common'
import type { Category } from '@/domain/entities/Category'
import type { MetadataField, MetadataFieldType } from '@/domain/entities/MetadataStructure'

const props = defineProps<{
  open: boolean
  category: Category | null
}>()

const emit = defineEmits<{ close: [] }>()

const store = useMetadataStructureStore()
const toast = useToast()

const fieldTypes: { value: MetadataFieldType; label: string }[] = [
  { value: 'string', label: 'Teks pendek' },
  { value: 'text', label: 'Teks panjang' },
  { value: 'int', label: 'Angka bulat' },
  { value: 'float', label: 'Angka desimal' },
  { value: 'bool', label: 'Ya/Tidak' },
  { value: 'date', label: 'Tanggal' },
  { value: 'datetime', label: 'Tanggal & Waktu' },
  { value: 'enum', label: 'Pilihan (enum)' },
]

function emptyField(): MetadataField {
  return { name: '', label: '', type: 'string', nullable: true, unique: false }
}

const fields = reactive<MetadataField[]>([])
const loading = ref(false)
const saving = ref(false)
const alreadyExists = ref(false)

watch(
  () => [props.open, props.category?.id],
  async ([isOpen]) => {
    if (!isOpen || !props.category) return
    loading.value = true
    fields.splice(0, fields.length)
    try {
      const existing = await store.fetchForCategory(props.category.id)
      if (existing) {
        alreadyExists.value = true
        fields.push(...existing.fields.map((f) => ({ ...f })))
      } else {
        alreadyExists.value = false
        fields.push(emptyField())
      }
    } finally {
      loading.value = false
    }
  },
)

function addField() {
  fields.push(emptyField())
}

function removeField(index: number) {
  fields.splice(index, 1)
}

function optionsText(field: MetadataField): string {
  return (field.options ?? []).join(', ')
}

function setOptionsFromText(field: MetadataField, text: string) {
  field.options = text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function handleSave() {
  if (!props.category) return
  saving.value = true
  try {
    await store.save(props.category.id, fields)
    toast.success('Struktur metadata berhasil disimpan')
    emit('close')
  } catch (err) {
    toast.error(
      err instanceof DomainError ? err.message : 'Gagal menyimpan struktur metadata',
    )
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="`Metadata — ${category?.name ?? ''}`"
    max-width="720px"
    @close="emit('close')"
  >
    <p v-if="loading" class="state-message">Memuat…</p>
    <template v-else>
      <p v-if="alreadyExists" class="notice">
        Kategori ini sudah punya struktur metadata. Backend tidak mendukung
        pengeditan struktur yang sudah dibuat — daftar di bawah bersifat
        baca-saja.
      </p>

      <div v-for="(field, index) in fields" :key="index" class="field-row">
        <div class="field-row-grid">
          <div class="field">
            <label class="field-label">Nama field (key)</label>
            <input
              v-model="field.name"
              class="field-input"
              placeholder="mis. ram_gb"
              :disabled="alreadyExists"
            />
          </div>
          <div class="field">
            <label class="field-label">Label tampilan</label>
            <input
              v-model="field.label"
              class="field-input"
              placeholder="mis. RAM (GB)"
              :disabled="alreadyExists"
            />
          </div>
          <div class="field">
            <label class="field-label">Tipe</label>
            <select v-model="field.type" class="field-select" :disabled="alreadyExists">
              <option v-for="t in fieldTypes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Wajib diisi?</label>
            <select
              :value="field.nullable ? 'no' : 'yes'"
              class="field-select"
              :disabled="alreadyExists"
              @change="
                field.nullable =
                  ($event.target as HTMLSelectElement).value === 'no'
              "
            >
              <option value="no">Tidak wajib</option>
              <option value="yes">Wajib</option>
            </select>
          </div>
        </div>

        <div v-if="field.type === 'enum'" class="field">
          <label class="field-label">Pilihan (pisahkan dengan koma)</label>
          <input
            :value="optionsText(field)"
            class="field-input"
            placeholder="mis. Kecil, Sedang, Besar"
            :disabled="alreadyExists"
            @input="
              setOptionsFromText(field, ($event.target as HTMLInputElement).value)
            "
          />
        </div>

        <button
          v-if="!alreadyExists"
          type="button"
          class="btn btn-ghost btn-sm remove-btn"
          @click="removeField(index)"
        >
          Hapus field
        </button>
      </div>

      <button
        v-if="!alreadyExists"
        type="button"
        class="btn btn-ghost"
        @click="addField"
      >
        + Tambah field
      </button>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="emit('close')">
          {{ alreadyExists ? 'Tutup' : 'Batal' }}
        </button>
        <button
          v-if="!alreadyExists"
          type="button"
          class="btn btn-primary"
          :disabled="saving || fields.length === 0"
          @click="handleSave"
        >
          {{ saving ? 'Menyimpan…' : 'Simpan Struktur' }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.notice {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  border: 1px solid var(--color-warning-100);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  font-size: 12px;
  margin-bottom: var(--space-4);
}

.field-row {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
}

.field-row-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 var(--space-4);
}

.field-row .field {
  margin-bottom: var(--space-2);
}

.remove-btn {
  color: var(--color-danger-600);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-5);
}
</style>
