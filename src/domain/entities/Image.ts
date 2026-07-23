import type { ID } from './common'

export interface Image {
  id: ID
  locationId?: ID | null
  itemId?: ID | null
  imagePath: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Owner dari sebuah image. Constraint di backend mewajibkan tepat satu di
 * antara keduanya terisi (CHECK constraint table_image).
 */
export type ImageOwner = { itemId: ID } | { locationId: ID }

export interface CreateImagePayload {
  imagePath: string
  isPrimary?: boolean
  owner: ImageOwner
}

export interface UpdateImagePayload {
  imagePath?: string
  isPrimary?: boolean
}
