import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type { MetadataField, MetadataStructure } from '@/domain/entities/MetadataStructure'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

interface MetadataStructureState {
  byCategoryId: Record<ID, MetadataStructure | null>
  loading: boolean
  error: string | null
}

export const useMetadataStructureStore = defineStore('metadataStructure', {
  state: (): MetadataStructureState => ({
    byCategoryId: {},
    loading: false,
    error: null,
  }),

  actions: {
    async fetchForCategory(categoryId: ID) {
      this.loading = true
      this.error = null
      try {
        this.byCategoryId[categoryId] =
          await usecases.metadataStructure.getForCategory(categoryId)
      } catch (err) {
        this.error =
          err instanceof DomainError
            ? err.message
            : 'Gagal memuat struktur metadata'
      } finally {
        this.loading = false
      }
      return this.byCategoryId[categoryId]
    },

    async save(categoryId: ID, fields: MetadataField[]) {
      const structure = await usecases.metadataStructure.save(categoryId, fields)
      this.byCategoryId[categoryId] = structure
      return structure
    },
  },
})
