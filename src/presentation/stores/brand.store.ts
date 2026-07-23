import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from '@/domain/entities/Brand'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

interface BrandState {
  items: Brand[]
  loading: boolean
  error: string | null
}

/**
 * Store di presentation layer HANYA boleh memanggil usecases, tidak
 * pernah repository/infrastructure langsung. Tugasnya murni state
 * management (loading/error/list) untuk dikonsumsi komponen Vue.
 */
export const useBrandStore = defineStore('brand', {
  state: (): BrandState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId:
      (state) =>
      (id: ID): Brand | undefined =>
        state.items.find((b) => b.id === id),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await usecases.brand.list()
      } catch (err) {
        this.error = err instanceof DomainError ? err.message : 'Gagal memuat brand'
      } finally {
        this.loading = false
      }
    },

    async create(payload: CreateBrandPayload) {
      const brand = await usecases.brand.create(payload)
      this.items.unshift(brand)
      return brand
    },

    async update(id: ID, payload: UpdateBrandPayload) {
      const brand = await usecases.brand.update(id, payload)
      const index = this.items.findIndex((b) => b.id === id)
      if (index !== -1) this.items[index] = brand
      return brand
    },

    async remove(id: ID) {
      await usecases.brand.remove(id)
      this.items = this.items.filter((b) => b.id !== id)
    },
  },
})
