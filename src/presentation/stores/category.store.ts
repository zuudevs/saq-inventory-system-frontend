import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/domain/entities/Category'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

interface CategoryState {
  items: Category[]
  loading: boolean
  error: string | null
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId:
      (state) =>
      (id: ID): Category | undefined =>
        state.items.find((c) => c.id === id),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await usecases.category.list()
      } catch (err) {
        this.error =
          err instanceof DomainError ? err.message : 'Gagal memuat kategori'
      } finally {
        this.loading = false
      }
    },

    async create(payload: CreateCategoryPayload) {
      const category = await usecases.category.create(payload)
      this.items.unshift(category)
      return category
    },

    async update(id: ID, payload: UpdateCategoryPayload) {
      const category = await usecases.category.update(id, payload)
      const index = this.items.findIndex((c) => c.id === id)
      if (index !== -1) this.items[index] = category
      return category
    },

    async remove(id: ID) {
      await usecases.category.remove(id)
      this.items = this.items.filter((c) => c.id !== id)
    },
  },
})
