import type { BrandRepository } from '@/domain/repositories/BrandRepository'
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from '@/domain/entities/Brand'
import type { ID } from '@/domain/entities/common'
import { DomainError } from '@/domain/entities/common'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

/** Bentuk mentah BrandResponse dari backend (snake_case). */
interface BrandDto {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

function toBrand(dto: BrandDto): Brand {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export class HttpBrandRepository implements BrandRepository {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async findAll(): Promise<Brand[]> {
    const dtos = await this.http.get<BrandDto[]>(endpoints.brands)
    return dtos.map(toBrand)
  }

  async findById(id: ID): Promise<Brand | null> {
    try {
      const dto = await this.http.get<BrandDto>(endpoints.brand(id))
      return toBrand(dto)
    } catch (error) {
      if (error instanceof DomainError && error.statusCode === 404) return null
      throw error
    }
  }

  async create(payload: CreateBrandPayload): Promise<Brand> {
    const dto = await this.http.post<BrandDto>(endpoints.brands, {
      name: payload.name,
    })
    return toBrand(dto)
  }

  async update(id: ID, payload: UpdateBrandPayload): Promise<Brand> {
    const dto = await this.http.put<BrandDto>(endpoints.brand(id), {
      name: payload.name,
    })
    return toBrand(dto)
  }

  async remove(id: ID): Promise<void> {
    await this.http.delete<null>(endpoints.brand(id))
  }
}
