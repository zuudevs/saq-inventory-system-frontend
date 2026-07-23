import type { ID } from '../entities/common'
import type {
  MetadataStructure,
  CreateMetadataStructurePayload,
} from '../entities/MetadataStructure'

export interface MetadataStructureRepository {
  findByCategoryId(categoryId: ID): Promise<MetadataStructure | null>
  create(
    categoryId: ID,
    payload: CreateMetadataStructurePayload,
  ): Promise<MetadataStructure>
}
