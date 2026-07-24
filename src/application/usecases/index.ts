import { container } from '@/infrastructure/container'
import { BrandUseCases } from './brand/BrandUseCases'
import { CategoryUseCases } from './category/CategoryUseCases'
import { LocationUseCases } from './location/LocationUseCases'
import { ItemUseCases } from './item/ItemUseCases'
import { ImageUseCases } from './image/ImageUseCases'
import { MetadataStructureUseCases } from './metadataStructure/MetadataStructureUseCases'
import { ExportImportUseCases } from './exportImport/ExportImportUseCases'

/**
 * Titik akses tunggal ke semua use case aplikasi. Store di presentation
 * layer hanya boleh import dari sini, tidak pernah dari infrastructure/
 * langsung — itulah yang membuat arah dependency-nya benar:
 * presentation -> application -> domain <- infrastructure.
 */
export const usecases = {
  brand: new BrandUseCases(container.brandRepository),
  category: new CategoryUseCases(container.categoryRepository),
  location: new LocationUseCases(container.locationRepository),
  item: new ItemUseCases(container.itemRepository),
  image: new ImageUseCases(container.imageRepository),
  metadataStructure: new MetadataStructureUseCases(
    container.metadataStructureRepository,
  ),
  exportImport: new ExportImportUseCases(container.exportImportRepository),
}
