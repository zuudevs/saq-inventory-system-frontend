import type { ID } from '../entities/common'
import type { Item, CreateItemPayload, UpdateItemPayload } from '../entities/Item'

export interface ItemRepository {
  findAll(): Promise<Item[]>
  findById(id: ID): Promise<Item | null>
  create(payload: CreateItemPayload): Promise<Item>
  update(id: ID, payload: UpdateItemPayload): Promise<Item>
  remove(id: ID): Promise<void>
}
