import type { ID } from './common'

export interface Category {
  id: ID
  name: string
  slug: string
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryPayload {
  name: string
  description?: string
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string
}
