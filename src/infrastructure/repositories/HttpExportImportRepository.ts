import type { ExportImportRepository } from '@/domain/repositories/ExportImportRepository'
import type { ImportSummary, HealthStatus } from '@/domain/entities/ExportImport'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

interface ImportSummaryDto {
  brands_imported: number
  categories_imported: number
  locations_imported: number
  items_imported: number
  images_imported: number
  total_imported: number
}

interface HealthResponseDto {
  status: string
  service: string
  version: string
  timestamp: string
}

export class HttpExportImportRepository implements ExportImportRepository {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async exportCsv(): Promise<Blob> {
    return this.http.getBlob(endpoints.exportsCsv)
  }

  async exportXlsx(): Promise<Blob> {
    return this.http.getBlob(endpoints.exportsXlsx)
  }

  async importXlsx(file: File): Promise<ImportSummary> {
    const form = new FormData()
    form.append('file', file)
    const dto = await this.http.postForm<ImportSummaryDto>(
      endpoints.importsXlsx,
      form,
    )
    return {
      brandsImported: dto.brands_imported,
      categoriesImported: dto.categories_imported,
      locationsImported: dto.locations_imported,
      itemsImported: dto.items_imported,
      imagesImported: dto.images_imported,
      totalImported: dto.total_imported,
    }
  }

  async getHealth(): Promise<HealthStatus> {
    const dto = await this.http.get<HealthResponseDto>(endpoints.health)
    return {
      status: dto.status,
      service: dto.service,
      version: dto.version,
      timestamp: dto.timestamp,
    }
  }
}
