import type { CategoryRepository } from '@/domain/repositories/CategoryRepository'
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/domain/entities/Category'
import type { ID } from '@/domain/entities/common'
import { DomainError } from '@/domain/entities/common'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

interface CategoryDto {
  id: number
  name: string
  slug: string
  description?: string | null
  created_at: string
  updated_at: string
}

function toCategory(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export class HttpCategoryRepository implements CategoryRepository {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async findAll(): Promise<Category[]> {
    const dtos = await this.http.get<CategoryDto[]>(endpoints.categories)
    return dtos.map(toCategory)
  }

  async findById(id: ID): Promise<Category | null> {
    try {
      const dto = await this.http.get<CategoryDto>(endpoints.category(id))
      return toCategory(dto)
    } catch (error) {
      if (error instanceof DomainError && error.statusCode === 404) return null
      throw error
    }
  }

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const dto = await this.http.post<CategoryDto>(endpoints.categories, {
      name: payload.name,
      description: payload.description,
    })
    return toCategory(dto)
  }

  async update(id: ID, payload: UpdateCategoryPayload): Promise<Category> {
    const dto = await this.http.put<CategoryDto>(endpoints.category(id), {
      name: payload.name,
      description: payload.description,
    })
    return toCategory(dto)
  }

  async remove(id: ID): Promise<void> {
    await this.http.delete<null>(endpoints.category(id))
  }
}
