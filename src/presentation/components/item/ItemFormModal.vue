<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import Modal from '@/presentation/components/common/Modal.vue'
import MetadataFieldInput from './MetadataFieldInput.vue'
import { useBrandStore } from '@/presentation/stores/brand.store'
import { useCategoryStore } from '@/presentation/stores/category.store'
import { useLocationStore } from '@/presentation/stores/location.store'
import { useMetadataStructureStore } from '@/presentation/stores/metadataStructure.store'
import { ITEM_CONDITIONS, ITEM_STATUSES, type Item } from '@/domain/entities/Item'
import { presentCondition, presentStatus } from '@/presentation/utils/itemPresentation'
import type { CreateItemPayload, UpdateItemPayload } from '@/domain/entities/Item'

const props = defineProps<{
  open: boolean
  editing: Item | null
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: CreateItemPayload | UpdateItemPayload]
}>()

const brandStore = useBrandStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const metadataStore = useMetadataStructureStore()

const form = reactive({
  brandId: undefined as number | undefined,
  categoryId: undefined as number | undefined,
  locationId: undefined as number | undefined,
  assetCode: '',
  name: '',
  itemCondition: 'good' as Item['itemCondition'],
  itemStatus: 'active' as Item['itemStatus'],
  notes: '',
})

const metadataValues = reactive<Record<string, unknown>>({})

const activeMetadataFields = computed(() => {
  if (!form.categoryId) return []
  return metadataStore.byCategoryId[form.categoryId]?.fields ?? []
})

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return

    if (!brandStore.items.length) brandStore.fetchAll()
    if (!categoryStore.items.length) categoryStore.fetchAll()
    if (!locationStore.items.length) locationStore.fetchAll()

    const item = props.editing
    form.brandId = item?.brandId ?? undefined
    form.categoryId = item?.categoryId ?? undefined
    form.locationId = item?.locationId ?? undefined
    form.assetCode = item?.assetCode ?? ''
    form.name = item?.name ?? ''
    form.itemCondition = item?.itemCondition ?? 'good'
    form.itemStatus = item?.itemStatus ?? 'active'
    form.notes = item?.notes ?? ''

    Object.keys(metadataValues).forEach((k) => delete metadataValues[k])
    if (item?.metadata) Object.assign(metadataValues, item.metadata)

    if (form.categoryId) await metadataStore.fetchForCategory(form.categoryId)
  },
)

watch(
  () => form.categoryId,
  async (categoryId) => {
    if (!categoryId) return
    if (!metadataStore.byCategoryId[categoryId]) {
      await metadataStore.fetchForCategory(categoryId)
    }
    // Reset nilai metadata saat kategori berganti dan ini bukan mode edit
    // dengan kategori yang sama seperti data awal, supaya tidak mengirim
    // field metadata milik kategori lain.
    if (!props.editing || props.editing.categoryId !== categoryId) {
      Object.keys(metadataValues).forEach((k) => delete metadataValues[k])
    }
  },
)

function handleSubmit() {
  if (!form.name.trim() || !form.assetCode.trim() || !form.categoryId) return

  if (props.editing) {
    const payload: UpdateItemPayload = {
      categoryId: form.categoryId,
      assetCode: form.assetCode.trim(),
      name: form.name.trim(),
      itemCondition: form.itemCondition,
      itemStatus: form.itemStatus,
      notes: form.notes.trim() || undefined,
    }
    if (form.brandId) payload.brandId = form.brandId
    if (form.locationId) payload.locationId = form.locationId
    emit('submit', payload)
  } else {
    const payload: CreateItemPayload = {
      categoryId: form.categoryId,
      assetCode: form.assetCode.trim(),
      name: form.name.trim(),
      itemCondition: form.itemCondition,
      itemStatus: form.itemStatus,
      notes: form.notes.trim() || undefined,
      brandId: form.brandId,
      locationId: form.locationId,
      metadata:
        activeMetadataFields.value.length > 0 ? { ...metadataValues } : undefined,
    }
    emit('submit', payload)
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="editing ? 'Edit Item' : 'Tambah Item'"
    max-width="640px"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit">
      <div class="grid-2">
        <div class="field">
          <label class="field-label">Kode Aset</label>
          <input
            v-model="form.assetCode"
            class="field-input"
            placeholder="mis. AST-0001"
            autofocus
          />
        </div>
        <div class="field">
          <label class="field-label">Nama Item</label>
          <input
            v-model="form.name"
            class="field-input"
            placeholder="mis. Laptop Dell E5440"
          />
        </div>
      </div>

      <div class="grid-2">
        <div class="field">
          <label class="field-label">Kategori</label>
          <select v-model.number="form.categoryId" class="field-select">
            <option :value="undefined" disabled>Pilih kategori</option>
            <option v-for="c in categoryStore.items" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Brand (opsional)</label>
          <select v-model.number="form.brandId" class="field-select">
            <option :value="undefined">— Tidak ada —</option>
            <option v-for="b in brandStore.items" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid-2">
        <div class="field">
          <label class="field-label">Lokasi (opsional)</label>
          <select v-model.number="form.locationId" class="field-select">
            <option :value="undefined">— Tidak ada —</option>
            <option v-for="l in locationStore.items" :key="l.id" :value="l.id">
              {{ l.name }}
            </option>
          </select>
        </div>
        <div class="field"></div>
      </div>

      <div class="grid-2">
        <div class="field">
          <label class="field-label">Kondisi</label>
          <select v-model="form.itemCondition" class="field-select">
            <option v-for="c in ITEM_CONDITIONS" :key="c" :value="c">
              {{ presentCondition(c).label }}
            </option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Status</label>
          <select v-model="form.itemStatus" class="field-select">
            <option v-for="s in ITEM_STATUSES" :key="s" :value="s">
              {{ presentStatus(s).label }}
            </option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="field-label">Catatan (opsional)</label>
        <textarea v-model="form.notes" class="field-textarea" />
      </div>

      <template v-if="!editing && activeMetadataFields.length > 0">
        <hr class="divider" />
        <p class="section-label">Metadata Kategori</p>
        <MetadataFieldInput
          v-for="mf in activeMetadataFields"
          :key="mf.name"
          :field="mf"
          v-model="metadataValues[mf.name]"
        />
      </template>

      <p v-if="editing" class="field-hint edit-note">
        Field metadata dinamis hanya bisa diisi saat pembuatan item baru pada
        versi backend ini.
      </p>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="emit('close')">
          Batal
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="
            submitting || !form.name.trim() || !form.assetCode.trim() || !form.categoryId
          "
        >
          {{ submitting ? 'Menyimpan…' : 'Simpan' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 var(--space-4);
}
.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-4) 0;
}
.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}
.edit-note {
  margin-bottom: var(--space-3);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-2);
}
</style>
