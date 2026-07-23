import type { MetadataStructureRepository } from '@/domain/repositories/MetadataStructureRepository'
import type {
  MetadataStructure,
  MetadataField,
  CreateMetadataStructurePayload,
} from '@/domain/entities/MetadataStructure'
import type { ID } from '@/domain/entities/common'
import { DomainError } from '@/domain/entities/common'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

interface MetadataStructureDto {
  id: number
  category_id: number
  fields: MetadataField[]
  version: number
  created_at: string
  updated_at: string
}

function toMetadataStructure(dto: MetadataStructureDto): MetadataStructure {
  return {
    id: dto.id,
    categoryId: dto.category_id,
    fields: dto.fields,
    version: dto.version,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export class HttpMetadataStructureRepository
  implements MetadataStructureRepository
{
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async findByCategoryId(categoryId: ID): Promise<MetadataStructure | null> {
    try {
      const dto = await this.http.get<MetadataStructureDto>(
        endpoints.metadataStructure(categoryId),
      )
      return toMetadataStructure(dto)
    } catch (error) {
      if (error instanceof DomainError && error.statusCode === 404) return null
      throw error
    }
  }

  async create(
    categoryId: ID,
    payload: CreateMetadataStructurePayload,
  ): Promise<MetadataStructure> {
    const dto = await this.http.post<MetadataStructureDto>(
      endpoints.metadataStructure(categoryId),
      { fields: payload.fields },
    )
    return toMetadataStructure(dto)
  }
}
