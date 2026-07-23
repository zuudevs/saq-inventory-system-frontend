import { defineStore } from 'pinia'
import { usecases } from '@/application/usecases'
import type { Item, CreateItemPayload, UpdateItemPayload } from '@/domain/entities/Item'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

interface ItemState {
  items: Item[]
  loading: boolean
  error: string | null
}

export const useItemStore = defineStore('item', {
  state: (): ItemState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    byId:
      (state) =>
      (id: ID): Item | undefined =>
        state.items.find((i) => i.id === id),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await usecases.item.list()
      } catch (err) {
        this.error = err instanceof DomainError ? err.message : 'Gagal memuat item'
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id: ID) {
      const item = await usecases.item.get(id)
      if (item) {
        const index = this.items.findIndex((i) => i.id === id)
        if (index !== -1) this.items[index] = item
        else this.items.push(item)
      }
      return item
    },

    async create(payload: CreateItemPayload) {
      const item = await usecases.item.create(payload)
      this.items.unshift(item)
      return item
    },

    async update(id: ID, payload: UpdateItemPayload) {
      const item = await usecases.item.update(id, payload)
      const index = this.items.findIndex((i) => i.id === id)
      if (index !== -1) this.items[index] = item
      return item
    },

    async remove(id: ID) {
      await usecases.item.remove(id)
      this.items = this.items.filter((i) => i.id !== id)
    },
  },
})
