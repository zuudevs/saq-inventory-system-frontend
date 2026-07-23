import type { ItemRepository } from '@/domain/repositories/ItemRepository'
import type {
  Item,
  CreateItemPayload,
  UpdateItemPayload,
  ItemCondition,
  ItemStatus,
} from '@/domain/entities/Item'
import type { ID } from '@/domain/entities/common'
import { DomainError } from '@/domain/entities/common'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

interface ItemDto {
  id: number
  brand_id?: number | null
  category_id: number
  location_id?: number | null
  asset_code: string
  name: string
  slug: string
  item_condition: string
  item_status: string
  notes?: string | null
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

function toItem(dto: ItemDto): Item {
  return {
    id: dto.id,
    brandId: dto.brand_id ?? null,
    categoryId: dto.category_id,
    locationId: dto.location_id ?? null,
    assetCode: dto.asset_code,
    name: dto.name,
    slug: dto.slug,
    itemCondition: dto.item_condition as ItemCondition,
    itemStatus: dto.item_status as ItemStatus,
    notes: dto.notes ?? null,
    metadata: dto.metadata,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export class HttpItemRepository implements ItemRepository {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async findAll(): Promise<Item[]> {
    const dtos = await this.http.get<ItemDto[]>(endpoints.items)
    return dtos.map(toItem)
  }

  async findById(id: ID): Promise<Item | null> {
    try {
      const dto = await this.http.get<ItemDto>(endpoints.item(id))
      return toItem(dto)
    } catch (error) {
      if (error instanceof DomainError && error.statusCode === 404) return null
      throw error
    }
  }

  async create(payload: CreateItemPayload): Promise<Item> {
    const dto = await this.http.post<ItemDto>(endpoints.items, {
      brand_id: payload.brandId,
      category_id: payload.categoryId,
      location_id: payload.locationId,
      asset_code: payload.assetCode,
      name: payload.name,
      item_condition: payload.itemCondition,
      item_status: payload.itemStatus,
      notes: payload.notes,
      metadata: payload.metadata,
    })
    return toItem(dto)
  }

  async update(id: ID, payload: UpdateItemPayload): Promise<Item> {
    const dto = await this.http.put<ItemDto>(endpoints.item(id), {
      brand_id: payload.brandId,
      category_id: payload.categoryId,
      location_id: payload.locationId,
      asset_code: payload.assetCode,
      name: payload.name,
      item_condition: payload.itemCondition,
      item_status: payload.itemStatus,
      notes: payload.notes,
    })
    return toItem(dto)
  }

  async remove(id: ID): Promise<void> {
    await this.http.delete<null>(endpoints.item(id))
  }
}
