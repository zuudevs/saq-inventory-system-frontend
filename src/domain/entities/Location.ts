import type { ID } from './common'

export interface Location {
  id: ID
  name: string
  slug: string
  roomCode?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateLocationPayload {
  name: string
  roomCode?: string
  description?: string
}

export interface UpdateLocationPayload {
  name?: string
  roomCode?: string
  description?: string
}
