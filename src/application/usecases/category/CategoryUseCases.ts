import type { CategoryRepository } from '@/domain/repositories/CategoryRepository'
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/domain/entities/Category'
import type { ID } from '@/domain/entities/common'

export class CategoryUseCases {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  list(): Promise<Category[]> {
    return this.repository.findAll()
  }

  get(id: ID): Promise<Category | null> {
    return this.repository.findById(id)
  }

  create(payload: CreateCategoryPayload): Promise<Category> {
    const name = payload.name.trim()
    if (!name) {
      throw new Error('Nama kategori tidak boleh kosong')
    }
    return this.repository.create({ ...payload, name })
  }

  update(id: ID, payload: UpdateCategoryPayload): Promise<Category> {
    return this.repository.update(id, payload)
  }

  remove(id: ID): Promise<void> {
    return this.repository.remove(id)
  }
}
