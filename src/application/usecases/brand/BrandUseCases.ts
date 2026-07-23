import type { BrandRepository } from '@/domain/repositories/BrandRepository'
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from '@/domain/entities/Brand'
import type { ID } from '@/domain/entities/common'

/**
 * Kumpulan use case untuk Brand. Dikelompokkan per entity (bukan satu
 * class per operasi) supaya tidak terlalu banyak file kecil untuk operasi
 * CRUD sederhana, tapi tetap terpisah jelas dari repository (application
 * layer tidak tahu axios/HTTP) dan dari store (presentation layer tidak
 * tahu urutan pemanggilan repository).
 */
export class BrandUseCases {
  private readonly repository: BrandRepository

  constructor(repository: BrandRepository) {
    this.repository = repository
  }

  list(): Promise<Brand[]> {
    return this.repository.findAll()
  }

  get(id: ID): Promise<Brand | null> {
    return this.repository.findById(id)
  }

  create(payload: CreateBrandPayload): Promise<Brand> {
    const name = payload.name.trim()
    if (!name) {
      throw new Error('Nama brand tidak boleh kosong')
    }
    return this.repository.create({ name })
  }

  update(id: ID, payload: UpdateBrandPayload): Promise<Brand> {
    return this.repository.update(id, payload)
  }

  remove(id: ID): Promise<void> {
    return this.repository.remove(id)
  }
}
