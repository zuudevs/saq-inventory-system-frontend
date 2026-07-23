import type { ID } from '../entities/common'
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from '../entities/Location'

export interface LocationRepository {
  findAll(): Promise<Location[]>
  findById(id: ID): Promise<Location | null>
  create(payload: CreateLocationPayload): Promise<Location>
  update(id: ID, payload: UpdateLocationPayload): Promise<Location>
  remove(id: ID): Promise<void>
}
