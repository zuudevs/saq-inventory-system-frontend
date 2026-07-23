import type { ID } from '../entities/common'
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from '../entities/Brand'

/**
 * Kontrak akses data Brand. Use case & store di presentation hanya
 * bergantung pada interface ini, bukan implementasi HTTP konkretnya —
 * supaya bisa diganti (mis. jadi mock untuk testing) tanpa menyentuh
 * use case sama sekali.
 */
export interface BrandRepository {
  findAll(): Promise<Brand[]>
  findById(id: ID): Promise<Brand | null>
  create(payload: CreateBrandPayload): Promise<Brand>
  update(id: ID, payload: UpdateBrandPayload): Promise<Brand>
  remove(id: ID): Promise<void>
}
