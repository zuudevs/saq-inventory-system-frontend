import type { ItemRepository } from '@/domain/repositories/ItemRepository'
import type { Item, CreateItemPayload, UpdateItemPayload } from '@/domain/entities/Item'
import type { ID } from '@/domain/entities/common'

export class ItemUseCases {
  private readonly repository: ItemRepository

  constructor(repository: ItemRepository) {
    this.repository = repository
  }

  list(): Promise<Item[]> {
    return this.repository.findAll()
  }

  get(id: ID): Promise<Item | null> {
    return this.repository.findById(id)
  }

  create(payload: CreateItemPayload): Promise<Item> {
    const name = payload.name.trim()
    const assetCode = payload.assetCode.trim()

    if (!name) throw new Error('Nama item tidak boleh kosong')
    if (!assetCode) throw new Error('Kode aset tidak boleh kosong')
    if (!payload.categoryId) throw new Error('Kategori wajib dipilih')

    return this.repository.create({ ...payload, name, assetCode })
  }

  update(id: ID, payload: UpdateItemPayload): Promise<Item> {
    return this.repository.update(id, payload)
  }

  remove(id: ID): Promise<void> {
    return this.repository.remove(id)
  }
}
