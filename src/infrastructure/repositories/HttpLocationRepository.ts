import type { LocationRepository } from '@/domain/repositories/LocationRepository'
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from '@/domain/entities/Location'
import type { ID } from '@/domain/entities/common'
import { DomainError } from '@/domain/entities/common'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

interface LocationDto {
  id: number
  name: string
  slug: string
  room_code?: string | null
  description?: string | null
  created_at: string
  updated_at: string
}

function toLocation(dto: LocationDto): Location {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    roomCode: dto.room_code ?? null,
    description: dto.description ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export class HttpLocationRepository implements LocationRepository {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async findAll(): Promise<Location[]> {
    const dtos = await this.http.get<LocationDto[]>(endpoints.locations)
    return dtos.map(toLocation)
  }

  async findById(id: ID): Promise<Location | null> {
    try {
      const dto = await this.http.get<LocationDto>(endpoints.location(id))
      return toLocation(dto)
    } catch (error) {
      if (error instanceof DomainError && error.statusCode === 404) return null
      throw error
    }
  }

  async create(payload: CreateLocationPayload): Promise<Location> {
    const dto = await this.http.post<LocationDto>(endpoints.locations, {
      name: payload.name,
      room_code: payload.roomCode,
      description: payload.description,
    })
    return toLocation(dto)
  }

  async update(id: ID, payload: UpdateLocationPayload): Promise<Location> {
    const dto = await this.http.put<LocationDto>(endpoints.location(id), {
      name: payload.name,
      room_code: payload.roomCode,
      description: payload.description,
    })
    return toLocation(dto)
  }

  async remove(id: ID): Promise<void> {
    await this.http.delete<null>(endpoints.location(id))
  }
}
