import type { ID } from './common'

/**
 * Tipe field metadata dinamis. Harus sinkron dengan
 * internal/models/metadata_structure.go (MetadataFieldType) di backend.
 */
export type MetadataFieldType =
  | 'string'
  | 'text'
  | 'int'
  | 'float'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'enum'

export interface MetadataField {
  name: string
  label: string
  type: MetadataFieldType
  length?: number
  precision?: number
  scale?: number
  options?: string[]
  nullable: boolean
  default?: string
  unique: boolean
}

export interface MetadataStructure {
  id: ID
  categoryId: ID
  fields: MetadataField[]
  version: number
  createdAt: string
  updatedAt: string
}

export interface CreateMetadataStructurePayload {
  fields: MetadataField[]
}
