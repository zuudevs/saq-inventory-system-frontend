import type { ExportImportRepository } from '@/domain/repositories/ExportImportRepository'
import type { ImportSummary, HealthStatus } from '@/domain/entities/ExportImport'

export class ExportImportUseCases {
  private readonly repo: ExportImportRepository

  constructor(repo: ExportImportRepository) {
    this.repo = repo
  }

  async exportCsv(): Promise<Blob> {
    return this.repo.exportCsv()
  }

  async exportXlsx(): Promise<Blob> {
    return this.repo.exportXlsx()
  }

  async importXlsx(file: File): Promise<ImportSummary> {
    return this.repo.importXlsx(file)
  }

  async getHealth(): Promise<HealthStatus> {
    return this.repo.getHealth()
  }
}
