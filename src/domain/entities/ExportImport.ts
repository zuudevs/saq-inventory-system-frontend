export interface ImportSummary {
  brandsImported: number
  categoriesImported: number
  locationsImported: number
  itemsImported: number
  imagesImported: number
  totalImported: number
}

export interface HealthStatus {
  status: string
  service: string
  version: string
  timestamp: string
}
