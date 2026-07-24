import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type { ImportSummary, HealthStatus } from '@/domain/entities/ExportImport'

interface ExportImportState {
  exportingCsv: boolean
  exportingXlsx: boolean
  importing: boolean
  importSummary: ImportSummary | null
  health: HealthStatus | null
  healthChecking: boolean
  error: string | null
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export const useExportImportStore = defineStore('exportImport', {
  state: (): ExportImportState => ({
    exportingCsv: false,
    exportingXlsx: false,
    importing: false,
    importSummary: null,
    health: null,
    healthChecking: false,
    error: null,
  }),

  actions: {
    async exportCsv() {
      this.exportingCsv = true
      this.error = null
      try {
        const blob = await usecases.exportImport.exportCsv()
        downloadBlob(blob, 'inventory-export.zip')
      } catch (err: any) {
        this.error = err?.message || 'Gagal mengekspor data CSV'
        throw err
      } finally {
        this.exportingCsv = false
      }
    },

    async exportXlsx() {
      this.exportingXlsx = true
      this.error = null
      try {
        const blob = await usecases.exportImport.exportXlsx()
        downloadBlob(blob, 'inventory-export.xlsx')
      } catch (err: any) {
        this.error = err?.message || 'Gagal mengekspor data XLSX'
        throw err
      } finally {
        this.exportingXlsx = false
      }
    },

    async importXlsx(file: File) {
      this.importing = true
      this.error = null
      this.importSummary = null
      try {
        const summary = await usecases.exportImport.importXlsx(file)
        this.importSummary = summary
        return summary
      } catch (err: any) {
        this.error = err?.message || 'Gagal mengimpor file Excel'
        throw err
      } finally {
        this.importing = false
      }
    },

    async checkHealth() {
      this.healthChecking = true
      try {
        this.health = await usecases.exportImport.getHealth()
      } catch {
        this.health = null
      } finally {
        this.healthChecking = false
      }
    },
  },
})
