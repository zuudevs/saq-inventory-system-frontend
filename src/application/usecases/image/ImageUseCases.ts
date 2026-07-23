import type { ImageRepository } from '@/domain/repositories/ImageRepository'
import type { Image, ImageOwner, UpdateImagePayload } from '@/domain/entities/Image'
import type { ID } from '@/domain/entities/common'

export class ImageUseCases {
  private readonly repository: ImageRepository

  constructor(repository: ImageRepository) {
    this.repository = repository
  }

  listByItem(itemId: ID): Promise<Image[]> {
    return this.repository.findByItemId(itemId)
  }

  listByLocation(locationId: ID): Promise<Image[]> {
    return this.repository.findByLocationId(locationId)
  }

  /**
   * Alur lengkap dari sisi UI: pilih file -> upload -> daftarkan sebagai
   * record image milik item/location. Digabung jadi satu use case supaya
   * komponen upload tidak perlu tahu bahwa backend memisahkan dua langkah
   * ini (lihat komentar CreateImageRequest di backend).
   */
  async uploadAndAttach(
    file: File,
    owner: ImageOwner,
    isPrimary = false,
  ): Promise<Image> {
    const imagePath = await this.repository.uploadFile(file)
    return this.repository.create({ imagePath, isPrimary, owner })
  }

  update(id: ID, payload: UpdateImagePayload): Promise<Image> {
    return this.repository.update(id, payload)
  }

  remove(id: ID): Promise<void> {
    return this.repository.remove(id)
  }
}
