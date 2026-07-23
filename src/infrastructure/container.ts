import { httpClient } from './http/HttpClient'
import { HttpBrandRepository } from './repositories/HttpBrandRepository'
import { HttpCategoryRepository } from './repositories/HttpCategoryRepository'
import { HttpLocationRepository } from './repositories/HttpLocationRepository'
import { HttpItemRepository } from './repositories/HttpItemRepository'
import { HttpImageRepository } from './repositories/HttpImageRepository'
import { HttpMetadataStructureRepository } from './repositories/HttpMetadataStructureRepository'

/**
 * Composition root: satu-satunya tempat implementasi konkret repository
 * di-instansiasi dan "dipasang" ke interface domain. Use case & store di
 * presentation layer import dari sini, bukan dari infrastructure/repositories
 * langsung — supaya kalau nanti mau ganti implementasi (mis. jadi
 * IndexedDB/mock untuk testing) cukup ubah satu file ini.
 */
export const container = {
  brandRepository: new HttpBrandRepository(httpClient),
  categoryRepository: new HttpCategoryRepository(httpClient),
  locationRepository: new HttpLocationRepository(httpClient),
  itemRepository: new HttpItemRepository(httpClient),
  imageRepository: new HttpImageRepository(httpClient),
  metadataStructureRepository: new HttpMetadataStructureRepository(httpClient),
}
