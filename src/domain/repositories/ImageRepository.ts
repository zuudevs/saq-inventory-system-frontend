import type { ID } from '../entities/common'
import type { Image, CreateImagePayload, UpdateImagePayload } from '../entities/Image'

export interface ImageRepository {
  findAll(): Promise<Image[]>
  findByItemId(itemId: ID): Promise<Image[]>
  findByLocationId(locationId: ID): Promise<Image[]>
  findById(id: ID): Promise<Image | null>
  /** Upload file mentah ke storage backend, return path relatif siap pakai di create(). */
  uploadFile(file: File): Promise<string>
  create(payload: CreateImagePayload): Promise<Image>
  update(id: ID, payload: UpdateImagePayload): Promise<Image>
  remove(id: ID): Promise<void>
}
