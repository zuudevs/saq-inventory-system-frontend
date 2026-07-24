import type { MetadataField } from '@/domain/entities/MetadataStructure'

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
const dateLiteralPattern = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/

export interface ValidationResult {
  valid: boolean
  errors: string[]
  data?: Record<string, unknown>
}

export function validateMetadataJson(
  fields: MetadataField[],
  jsonText: string
): ValidationResult {
  const errors: string[] = []

  let payload: Record<string, unknown>
  try {
    const parsed = JSON.parse(jsonText)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        valid: false,
        errors: ['JSON harus berupa sebuah objek (e.g. { "field": "value" })'],
      }
    }
    payload = parsed as Record<string, unknown>
  } catch (e: any) {
    return {
      valid: false,
      errors: [`Format JSON tidak valid: ${e.message}`],
    }
  }

  const allowed = new Map<string, MetadataField>()
  for (const field of fields) {
    allowed.set(field.name, field)
  }

  // Check for unknown fields in the payload
  for (const key of Object.keys(payload)) {
    if (!allowed.has(key)) {
      errors.push(`Field '${key}' tidak dikenali dalam kategori ini.`)
    }
  }

  const result: Record<string, unknown> = {}

  // Check each schema field
  for (const field of fields) {
    const exists = keyExists(payload, field.name)
    const raw = payload[field.name]

    if (!exists || raw === null || raw === undefined) {
      if (field.nullable || (field.default !== undefined && field.default !== null)) {
        continue
      }
      errors.push(`Field '${field.name}' (${field.label}) wajib diisi.`)
      continue
    }

    // Coerce and validate
    switch (field.type) {
      case 'string':
      case 'text': {
        if (typeof raw !== 'string') {
          errors.push(`Field '${field.name}' (${field.label}) harus berupa teks (string).`)
          break
        }
        if (field.type === 'string') {
          const length = field.length ?? 255
          if (raw.length > length) {
            errors.push(
              `Field '${field.name}' (${field.label}) melebihi panjang maksimum ${length} karakter.`
            )
          }
        }
        result[field.name] = raw
        break
      }

      case 'int': {
        if (typeof raw !== 'number' || !Number.isInteger(raw)) {
          errors.push(`Field '${field.name}' (${field.label}) harus berupa angka bulat (integer).`)
          break
        }
        result[field.name] = raw
        break
      }

      case 'float': {
        if (typeof raw !== 'number') {
          errors.push(`Field '${field.name}' (${field.label}) harus berupa angka (number/float).`)
          break
        }
        result[field.name] = raw
        break
      }

      case 'bool': {
        if (typeof raw !== 'boolean') {
          errors.push(`Field '${field.name}' (${field.label}) harus berupa boolean (true/false).`)
          break
        }
        result[field.name] = raw
        break
      }

      case 'date': {
        if (typeof raw !== 'string' || !dateOnlyPattern.test(raw)) {
          errors.push(
            `Field '${field.name}' (${field.label}) harus berformat tanggal YYYY-MM-DD (contoh: 2026-07-24).`
          )
          break
        }
        result[field.name] = raw
        break
      }

      case 'datetime': {
        if (typeof raw !== 'string' || !dateLiteralPattern.test(raw)) {
          errors.push(
            `Field '${field.name}' (${field.label}) harus berformat waktu yang valid (contoh: 2026-07-24 13:00).`
          )
          break
        }
        result[field.name] = raw
        break
      }

      case 'enum': {
        if (typeof raw !== 'string') {
          errors.push(`Field '${field.name}' (${field.label}) harus berupa teks (string).`)
          break
        }
        const options = field.options ?? []
        if (!options.includes(raw)) {
          errors.push(
            `Field '${field.name}' (${field.label}) harus bernilai salah satu dari: ${options.join(', ')}.`
          )
          break
        }
        result[field.name] = raw
        break
      }

      default:
        errors.push(`Tipe data '${field.type}' pada field '${field.name}' tidak didukung.`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? result : undefined,
  }
}

function keyExists(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function generateMetadataTemplate(fields: MetadataField[]): string {
  const obj: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.default !== undefined && field.default !== null) {
      if (field.type === 'int') {
        const val = parseInt(field.default, 10)
        obj[field.name] = isNaN(val) ? field.default : val
      } else if (field.type === 'float') {
        const val = parseFloat(field.default)
        obj[field.name] = isNaN(val) ? field.default : val
      } else if (field.type === 'bool') {
        obj[field.name] = field.default === 'true' || field.default === '1'
      } else {
        obj[field.name] = field.default
      }
    } else {
      switch (field.type) {
        case 'string':
        case 'text':
          obj[field.name] = ''
          break
        case 'int':
        case 'float':
          obj[field.name] = 0
          break
        case 'bool':
          obj[field.name] = false
          break
        case 'date':
          obj[field.name] = '2026-07-24'
          break
        case 'datetime':
          obj[field.name] = '2026-07-24 00:00:00'
          break
        case 'enum':
          obj[field.name] = field.options && field.options.length > 0 ? field.options[0] : ''
          break
        default:
          obj[field.name] = ''
      }
    }
  }
  return JSON.stringify(obj, null, 2)
}
