import type { ID } from './common'

export interface Brand {
  id: ID
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

/** Payload untuk membuat Brand baru. Slug dihasilkan otomatis oleh backend. */
export interface CreateBrandPayload {
  name: string
}

/** Payload untuk update Brand. Semua field opsional (partial update). */
export interface UpdateBrandPayload {
  name?: string
}
