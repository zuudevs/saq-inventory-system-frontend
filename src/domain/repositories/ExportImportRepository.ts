import type { ImportSummary, HealthStatus } from '../entities/ExportImport'

export interface ExportImportRepository {
  exportCsv(): Promise<Blob>
  exportXlsx(): Promise<Blob>
  importXlsx(file: File): Promise<ImportSummary>
  getHealth(): Promise<HealthStatus>
}
