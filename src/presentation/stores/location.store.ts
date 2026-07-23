import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from '@/domain/entities/Location'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

interface LocationState {
  items: Location[]
  loading: boolean
  error: string | null
}

export const useLocationStore = defineStore('location', {
  state: (): LocationState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId:
      (state) =>
      (id: ID): Location | undefined =>
        state.items.find((l) => l.id === id),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await usecases.location.list()
      } catch (err) {
        this.error =
          err instanceof DomainError ? err.message : 'Gagal memuat lokasi'
      } finally {
        this.loading = false
      }
    },

    async create(payload: CreateLocationPayload) {
      const location = await usecases.location.create(payload)
      this.items.unshift(location)
      return location
    },

    async update(id: ID, payload: UpdateLocationPayload) {
      const location = await usecases.location.update(id, payload)
      const index = this.items.findIndex((l) => l.id === id)
      if (index !== -1) this.items[index] = location
      return location
    },

    async remove(id: ID) {
      await usecases.location.remove(id)
      this.items = this.items.filter((l) => l.id !== id)
    },
  },
})
