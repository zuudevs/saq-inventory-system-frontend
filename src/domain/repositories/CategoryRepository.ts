import type { ID } from '../entities/common'
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../entities/Category'

export interface CategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: ID): Promise<Category | null>
  create(payload: CreateCategoryPayload): Promise<Category>
  update(id: ID, payload: UpdateCategoryPayload): Promise<Category>
  remove(id: ID): Promise<void>
}
