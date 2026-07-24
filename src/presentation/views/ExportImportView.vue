<script setup lang="ts">
import { ref } from 'vue'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import {
  Download,
  FileSpreadsheet,
  UploadCloud,
  FileUp,
  CheckCircle2,
} from 'lucide-vue-next'
import { useExportImportStore } from '@/presentation/stores/exportImport.store'
import { useToast } from '@/presentation/composables/useToast'
import type { ImportSummary } from '@/domain/entities/ExportImport'

const exportImportStore = useExportImportStore()
const toast = useToast()

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const summaryResult = ref<ImportSummary | null>(null)

async function handleExportCsv() {
  try {
    await exportImportStore.exportCsv()
    toast.success('File CSV berhasil diunduh')
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mengekspor data CSV')
  }
}

async function handleExportXlsx() {
  try {
    await exportImportStore.exportXlsx()
    toast.success('File XLSX berhasil diunduh')
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mengekspor data XLSX')
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    selectedFile.value = file
    summaryResult.value = null
  }
}

async function handleImport() {
  if (!selectedFile.value) return
  try {
    const result = await exportImportStore.importXlsx(selectedFile.value)
    summaryResult.value = result
    toast.success('Import file Excel berhasil!')
  } catch (err: any) {
    toast.error(err?.message || 'Gagal mengimpor file Excel')
  }
}

function resetImport() {
  selectedFile.value = null
  summaryResult.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div>
    <AppTopbar title="Import & Export" />

    <div class="page page-grid">
      <!-- Section Export -->
      <div class="card card-padded feature-card">
        <div class="card-header">
          <div class="card-icon export-icon">
            <Download :size="22" />
          </div>
          <div>
            <h2 class="card-title">Ekspor Data (Export)</h2>
            <p class="card-desc">
              Unduh seluruh data aset, kategori, brand, lokasi, gambar, dan metadata ke dalam format kompresi CSV atau spreadsheet Excel (XLSX).
            </p>
          </div>
        </div>

        <div class="export-actions">
          <button
            class="btn btn-outline action-btn"
            :disabled="exportImportStore.exportingCsv"
            @click="handleExportCsv"
          >
            <Download :size="16" />
            <span>{{ exportImportStore.exportingCsv ? 'Mengekspor…' : 'Export CSV (.zip)' }}</span>
          </button>

          <button
            class="btn btn-primary action-btn"
            :disabled="exportImportStore.exportingXlsx"
            @click="handleExportXlsx"
          >
            <FileSpreadsheet :size="16" />
            <span>{{ exportImportStore.exportingXlsx ? 'Mengekspor…' : 'Export Excel (.xlsx)' }}</span>
          </button>
        </div>
      </div>

      <!-- Section Import -->
      <div class="card card-padded feature-card">
        <div class="card-header">
          <div class="card-icon import-icon">
            <UploadCloud :size="22" />
          </div>
          <div>
            <h2 class="card-title">Impor Data (Import)</h2>
            <p class="card-desc">
              Unggah file spreadsheet Excel (<strong>.xlsx</strong>) untuk memasukkan atau memperbarui data aset inventaris secara massal.
            </p>
          </div>
        </div>

        <div v-if="!summaryResult" class="import-area">
          <div class="drop-zone" @click="fileInput?.click()">
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              hidden
              @change="handleFileSelect"
            />

            <div v-if="!selectedFile" class="drop-content">
              <FileUp :size="32" class="drop-icon" />
              <p class="drop-text">Klik untuk memilih file <strong>.xlsx</strong></p>
              <span class="drop-hint">Format file harus sesuai dengan template sistem</span>
            </div>

            <div v-else class="selected-file-box">
              <FileSpreadsheet :size="28" class="file-icon" />
              <div class="file-details">
                <p class="file-name">{{ selectedFile.name }}</p>
                <p class="file-size">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
              </div>
            </div>
          </div>

          <div class="import-actions">
            <button
              v-if="selectedFile"
              type="button"
              class="btn btn-ghost"
              @click="resetImport"
            >
              Batal
            </button>

            <button
              type="button"
              class="btn btn-primary action-btn"
              :disabled="!selectedFile || exportImportStore.importing"
              @click="handleImport"
            >
              <UploadCloud :size="16" />
              <span>{{ exportImportStore.importing ? 'Mengimpor…' : 'Mulai Import' }}</span>
            </button>
          </div>
        </div>

        <div v-else class="summary-area">
          <div class="summary-badge">
            <CheckCircle2 :size="18" />
            <span>Import Selesai!</span>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <span class="val">{{ summaryResult.itemsImported }}</span>
              <span class="lbl">Item</span>
            </div>
            <div class="summary-card">
              <span class="val">{{ summaryResult.categoriesImported }}</span>
              <span class="lbl">Kategori</span>
            </div>
            <div class="summary-card">
              <span class="val">{{ summaryResult.brandsImported }}</span>
              <span class="lbl">Brand</span>
            </div>
            <div class="summary-card">
              <span class="val">{{ summaryResult.locationsImported }}</span>
              <span class="lbl">Lokasi</span>
            </div>
            <div class="summary-card">
              <span class="val">{{ summaryResult.imagesImported }}</span>
              <span class="lbl">Gambar</span>
            </div>
            <div class="summary-card main-val">
              <span class="val">{{ summaryResult.totalImported }}</span>
              <span class="lbl">Total Entitas</span>
            </div>
          </div>

          <div class="summary-actions">
            <button type="button" class="btn btn-primary" @click="resetImport">
              Impor File Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: var(--space-6);
  align-items: start;
}

.feature-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.export-icon {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
}
.import-icon {
  background: #e0f2fe;
  color: #0284c7;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-1);
}
.card-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.export-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  cursor: pointer;
  background: var(--color-neutral-50, #f8fafc);
  transition: all 0.15s ease;
  margin-bottom: var(--space-4);
}
.drop-zone:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
}
.drop-icon {
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}
.drop-text {
  font-size: 13px;
  color: var(--color-text-primary);
}
.drop-hint {
  font-size: 11px;
  color: var(--color-text-muted);
}

.selected-file-box {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.file-icon {
  color: var(--color-primary);
}
.file-name {
  font-weight: 600;
  font-size: 14px;
}
.file-size {
  font-size: 12px;
  color: var(--color-text-muted);
}

.import-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.summary-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: #dcfce7;
  color: #15803d;
  font-weight: 600;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.summary-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  text-align: center;
}
.summary-card.main-val {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
}
.summary-card .val {
  display: block;
  font-size: 18px;
  font-weight: 700;
}
.summary-card .lbl {
  font-size: 11px;
  color: var(--color-text-muted);
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
