import type { MetadataStructureRepository } from '@/domain/repositories/MetadataStructureRepository'
import type {
  MetadataStructure,
  MetadataField,
} from '@/domain/entities/MetadataStructure'
import type { ID } from '@/domain/entities/common'

export class MetadataStructureUseCases {
  private readonly repository: MetadataStructureRepository

  constructor(repository: MetadataStructureRepository) {
    this.repository = repository
  }

  getForCategory(categoryId: ID): Promise<MetadataStructure | null> {
    return this.repository.findByCategoryId(categoryId)
  }

  /**
   * Backend hanya expose POST (create) untuk metadata structure, dan akan
   * menolak jika kategori tersebut sudah punya struktur (satu struktur
   * per kategori, tidak bisa diubah lagi lewat endpoint ini — lihat
   * MetadataStructureService.Create di backend). Use case ini dipanggil
   * hanya untuk kategori yang belum punya struktur sama sekali.
   */
  save(categoryId: ID, fields: MetadataField[]): Promise<MetadataStructure> {
    if (fields.length === 0) {
      throw new Error('Minimal harus ada satu field metadata')
    }
    if (fields.length > 50) {
      throw new Error('Maksimal 50 field metadata per kategori')
    }

    const names = fields.map((f) => f.name.trim())
    if (names.some((n) => !n)) {
      throw new Error('Nama field metadata tidak boleh kosong')
    }
    if (new Set(names).size !== names.length) {
      throw new Error('Nama field metadata tidak boleh duplikat')
    }

    return this.repository.create(categoryId, { fields })
  }
}
