import type { ID } from './common'

/** Harus sinkron dengan internal/models/item.go di backend. */
export type ItemCondition = 'good' | 'minor_damage' | 'major_damage' | 'lost'
export type ItemStatus = 'active' | 'inactive' | 'maintenance' | 'borrowed'

export const ITEM_CONDITIONS: ItemCondition[] = [
  'good',
  'minor_damage',
  'major_damage',
  'lost',
]

export const ITEM_STATUSES: ItemStatus[] = [
  'active',
  'inactive',
  'maintenance',
  'borrowed',
]

export interface Item {
  id: ID
  brandId?: ID | null
  categoryId: ID
  locationId?: ID | null
  assetCode: string
  name: string
  slug: string
  itemCondition: ItemCondition
  itemStatus: ItemStatus
  notes?: string | null
  /** Isi field dinamis sesuai MetadataStructure milik kategori item ini. */
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateItemPayload {
  brandId?: ID
  categoryId: ID
  locationId?: ID
  assetCode: string
  name: string
  itemCondition: ItemCondition
  itemStatus: ItemStatus
  notes?: string
  metadata?: Record<string, unknown>
}

/**
 * Catatan: backend tidak bisa membedakan "field tidak dikirim" vs "field
 * dikirim null" untuk brand_id/location_id (keduanya jadi nil pointer di
 * Go), jadi brand_id/location_id yang sudah terisi tidak bisa dikosongkan
 * lagi lewat endpoint update ini — hanya bisa diganti ke ID lain.
 */
export interface UpdateItemPayload {
  brandId?: ID
  categoryId?: ID
  locationId?: ID
  assetCode?: string
  name?: string
  itemCondition?: ItemCondition
  itemStatus?: ItemStatus
  notes?: string
}
