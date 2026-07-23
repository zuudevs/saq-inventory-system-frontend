import type { ItemCondition, ItemStatus } from '@/domain/entities/Item'

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const conditionMap: Record<ItemCondition, { label: string; tone: Tone }> = {
  good: { label: 'Baik', tone: 'success' },
  minor_damage: { label: 'Rusak Ringan', tone: 'warning' },
  major_damage: { label: 'Rusak Berat', tone: 'danger' },
  lost: { label: 'Hilang', tone: 'danger' },
}

const statusMap: Record<ItemStatus, { label: string; tone: Tone }> = {
  active: { label: 'Aktif', tone: 'success' },
  inactive: { label: 'Tidak Aktif', tone: 'neutral' },
  maintenance: { label: 'Maintenance', tone: 'warning' },
  borrowed: { label: 'Dipinjam', tone: 'info' },
}

export function presentCondition(condition: ItemCondition) {
  return conditionMap[condition]
}

export function presentStatus(status: ItemStatus) {
  return statusMap[status]
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
