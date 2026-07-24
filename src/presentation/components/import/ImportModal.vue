<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/presentation/components/common/Modal.vue'
import { useExportImportStore } from '@/presentation/stores/exportImport.store'
import { useToast } from '@/presentation/composables/useToast'
import type { ImportSummary } from '@/domain/entities/ExportImport'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  imported: []
}>()

const store = useExportImportStore()
const toast = useToast()

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const summaryResult = ref<ImportSummary | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedFile.value = null
      summaryResult.value = null
    }
  },
)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

async function handleImport() {
  if (!selectedFile.value) return
  try {
    const result = await store.importXlsx(selectedFile.value)
    summaryResult.value = result
    toast.success('Import file Excel berhasil dilakukan!')
    emit('imported')
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mengimpor file Excel')
  }
}

function handleClose() {
  selectedFile.value = null
  summaryResult.value = null
  emit('close')
}
</script>

<template>
  <Modal :open="open" title="Import Inventaris dari Excel (XLSX)" @close="handleClose">
    <div v-if="!summaryResult" class="import-body">
      <p class="import-help">
        Pilih file spreadsheet (<strong>.xlsx</strong>) yang sesuai dengan format ekspor/template sistem inventaris.
      </p>

      <div class="file-drop-area" @click="fileInput?.click()">
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hidden
          @change="handleFileSelect"
        />
        <div v-if="!selectedFile" class="drop-placeholder">
          <span class="icon">📄</span>
          <span>Klik untuk memilih file .xlsx</span>
        </div>
        <div v-else class="selected-file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">({{ (selectedFile.size / 1024).toFixed(1) }} KB)</span>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" @click="handleClose">
          Batal
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!selectedFile || store.importing"
          @click="handleImport"
        >
          {{ store.importing ? 'Mengimpor…' : 'Mulai Import' }}
        </button>
      </div>
    </div>

    <div v-else class="summary-body">
      <div class="summary-success-badge">
        ✓ Import Selesai!
      </div>
      <p class="summary-desc">Ringkasan data yang berhasil diproses ke dalam database:</p>

      <div class="summary-grid">
        <div class="summary-card">
          <span class="summary-val">{{ summaryResult.itemsImported }}</span>
          <span class="summary-lbl">Item Inventaris</span>
        </div>
        <div class="summary-card">
          <span class="summary-val">{{ summaryResult.categoriesImported }}</span>
          <span class="summary-lbl">Kategori</span>
        </div>
        <div class="summary-card">
          <span class="summary-val">{{ summaryResult.brandsImported }}</span>
          <span class="summary-lbl">Brand</span>
        </div>
        <div class="summary-card">
          <span class="summary-val">{{ summaryResult.locationsImported }}</span>
          <span class="summary-lbl">Lokasi</span>
        </div>
        <div class="summary-card">
          <span class="summary-val">{{ summaryResult.imagesImported }}</span>
          <span class="summary-lbl">Gambar</span>
        </div>
        <div class="summary-card highlight">
          <span class="summary-val">{{ summaryResult.totalImported }}</span>
          <span class="summary-lbl">Total Entitas</span>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-primary" @click="handleClose">
          Selesai
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.import-help {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.file-drop-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  text-align: center;
  cursor: pointer;
  background: var(--color-neutral-50, #f8fafc);
  transition: border-color 0.15s ease, background 0.15s ease;
}
.file-drop-area:hover {
  border-color: var(--color-primary);
  background: var(--color-neutral-100, #f1f5f9);
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: 13px;
}
.drop-placeholder .icon {
  font-size: 28px;
}

.selected-file-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.file-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text-primary);
}
.file-size {
  font-size: 12px;
  color: var(--color-text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-5);
}

.summary-success-badge {
  display: inline-block;
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 13px;
  margin-bottom: var(--space-2);
}

.summary-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.summary-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  text-align: center;
  background: #fff;
}
.summary-card.highlight {
  border-color: var(--color-primary);
  background: var(--color-neutral-50, #f8fafc);
}

.summary-val {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.summary-lbl {
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
