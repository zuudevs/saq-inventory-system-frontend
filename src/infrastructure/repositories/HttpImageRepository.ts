import type { ImageRepository } from '@/domain/repositories/ImageRepository'
import type {
  Image,
  CreateImagePayload,
  UpdateImagePayload,
} from '@/domain/entities/Image'
import type { ID } from '@/domain/entities/common'
import { DomainError } from '@/domain/entities/common'
import type { HttpClient } from '@/infrastructure/http/HttpClient'
import { endpoints } from '@/infrastructure/http/endpoints'

interface ImageDto {
  id: number
  location_id?: number | null
  item_id?: number | null
  image_path: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

interface UploadImageDto {
  image_path: string
}

function toImage(dto: ImageDto): Image {
  return {
    id: dto.id,
    locationId: dto.location_id ?? null,
    itemId: dto.item_id ?? null,
    imagePath: dto.image_path,
    isPrimary: dto.is_primary,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

export class HttpImageRepository implements ImageRepository {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async findAll(): Promise<Image[]> {
    const dtos = await this.http.get<ImageDto[]>(endpoints.images)
    return dtos.map(toImage)
  }

  async findByItemId(itemId: ID): Promise<Image[]> {
    const dtos = await this.http.get<ImageDto[]>(endpoints.images, {
      item_id: itemId,
    })
    return dtos.map(toImage)
  }

  async findByLocationId(locationId: ID): Promise<Image[]> {
    const dtos = await this.http.get<ImageDto[]>(endpoints.images, {
      location_id: locationId,
    })
    return dtos.map(toImage)
  }

  async findById(id: ID): Promise<Image | null> {
    try {
      const dto = await this.http.get<ImageDto>(endpoints.image(id))
      return toImage(dto)
    } catch (error) {
      if (error instanceof DomainError && error.statusCode === 404) return null
      throw error
    }
  }

  async uploadFile(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const dto = await this.http.postForm<UploadImageDto>(
      endpoints.imageUpload,
      form,
    )
    return dto.image_path
  }

  async create(payload: CreateImagePayload): Promise<Image> {
    const dto = await this.http.post<ImageDto>(endpoints.images, {
      image_path: payload.imagePath,
      is_primary: payload.isPrimary ?? false,
      item_id: 'itemId' in payload.owner ? payload.owner.itemId : undefined,
      location_id:
        'locationId' in payload.owner ? payload.owner.locationId : undefined,
    })
    return toImage(dto)
  }

  async update(id: ID, payload: UpdateImagePayload): Promise<Image> {
    const dto = await this.http.put<ImageDto>(endpoints.image(id), {
      image_path: payload.imagePath,
      is_primary: payload.isPrimary,
    })
    return toImage(dto)
  }

  async remove(id: ID): Promise<void> {
    await this.http.delete<null>(endpoints.image(id))
  }
}
