import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type { Image } from '@/domain/entities/Image'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

interface ImageState {
  /** Galeri di-cache per item, karena selalu diakses dalam konteks satu item. */
  byItemId: Record<ID, Image[]>
  loading: boolean
  uploading: boolean
  error: string | null
}

export const useImageStore = defineStore('image', {
  state: (): ImageState => ({
    byItemId: {},
    loading: false,
    uploading: false,
    error: null,
  }),

  actions: {
    async fetchForItem(itemId: ID) {
      this.loading = true
      this.error = null
      try {
        this.byItemId[itemId] = await usecases.image.listByItem(itemId)
      } catch (err) {
        this.error =
          err instanceof DomainError ? err.message : 'Gagal memuat galeri gambar'
      } finally {
        this.loading = false
      }
    },

    async uploadForItem(itemId: ID, file: File, isPrimary = false) {
      this.uploading = true
      this.error = null
      try {
        const image = await usecases.image.uploadAndAttach(
          file,
          { itemId },
          isPrimary,
        )
        if (!this.byItemId[itemId]) this.byItemId[itemId] = []
        this.byItemId[itemId].push(image)
        return image
      } finally {
        this.uploading = false
      }
    },

    async setPrimary(itemId: ID, imageId: ID) {
      const updated = await usecases.image.update(imageId, { isPrimary: true })
      const gallery = this.byItemId[itemId]
      if (gallery) {
        this.byItemId[itemId] = gallery.map((img) =>
          img.id === imageId ? updated : { ...img, isPrimary: false },
        )
      }
    },

    async remove(itemId: ID, imageId: ID) {
      await usecases.image.remove(imageId)
      const gallery = this.byItemId[itemId]
      if (gallery) {
        this.byItemId[itemId] = gallery.filter((img) => img.id !== imageId)
      }
    },
  },
})
