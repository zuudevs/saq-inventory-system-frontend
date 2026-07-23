import type { LocationRepository } from '@/domain/repositories/LocationRepository'
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from '@/domain/entities/Location'
import type { ID } from '@/domain/entities/common'

export class LocationUseCases {
  private readonly repository: LocationRepository

  constructor(repository: LocationRepository) {
    this.repository = repository
  }

  list(): Promise<Location[]> {
    return this.repository.findAll()
  }

  get(id: ID): Promise<Location | null> {
    return this.repository.findById(id)
  }

  create(payload: CreateLocationPayload): Promise<Location> {
    const name = payload.name.trim()
    if (!name) {
      throw new Error('Nama lokasi tidak boleh kosong')
    }
    return this.repository.create({ ...payload, name })
  }

  update(id: ID, payload: UpdateLocationPayload): Promise<Location> {
    return this.repository.update(id, payload)
  }

  remove(id: ID): Promise<void> {
    return this.repository.remove(id)
  }
}
