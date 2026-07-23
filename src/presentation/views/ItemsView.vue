<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import EmptyState from '@/presentation/components/common/EmptyState.vue'
import ConfirmDialog from '@/presentation/components/common/ConfirmDialog.vue'
import StatusBadge from '@/presentation/components/common/StatusBadge.vue'
import ItemFormModal from '@/presentation/components/item/ItemFormModal.vue'
import { useItemStore } from '@/presentation/stores/item.store'
import { useCategoryStore } from '@/presentation/stores/category.store'
import { useBrandStore } from '@/presentation/stores/brand.store'
import { useLocationStore } from '@/presentation/stores/location.store'
import { useToast } from '@/presentation/composables/useToast'
import { presentCondition, presentStatus } from '@/presentation/utils/itemPresentation'
import { DomainError } from '@/domain/entities/common'
import { ITEM_STATUSES, type Item, type CreateItemPayload, type UpdateItemPayload } from '@/domain/entities/Item'

const router = useRouter()
const itemStore = useItemStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const locationStore = useLocationStore()
const toast = useToast()

const search = ref('')
const categoryFilter = ref<number | ''>('')
const statusFilter = ref<Item['itemStatus'] | ''>('')

const modalOpen = ref(false)
const editing = ref<Item | null>(null)
const submitting = ref(false)
const deleteTarget = ref<Item | null>(null)
const deleting = ref(false)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return itemStore.items.filter((item) => {
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.assetCode.toLowerCase().includes(q)
    const matchesCategory =
      !categoryFilter.value || item.categoryId === categoryFilter.value
    const matchesStatus = !statusFilter.value || item.itemStatus === statusFilter.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})

function categoryName(categoryId: number): string {
  return categoryStore.byId(categoryId)?.name ?? '—'
}
function brandName(brandId?: number | null): string {
  if (!brandId) return '—'
  return brandStore.byId(brandId)?.name ?? '—'
}
function locationName(locationId?: number | null): string {
  if (!locationId) return '—'
  return locationStore.byId(locationId)?.name ?? '—'
}

onMounted(() => {
  itemStore.fetchAll()
  categoryStore.fetchAll()
  brandStore.fetchAll()
  locationStore.fetchAll()
})

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(item: Item) {
  editing.value = item
  modalOpen.value = true
}

function goToDetail(item: Item) {
  router.push(`/items/${item.id}`)
}

async function handleSubmit(payload: CreateItemPayload | UpdateItemPayload) {
  submitting.value = true
  try {
    if (editing.value) {
      await itemStore.update(editing.value.id, payload as UpdateItemPayload)
      toast.success('Item berhasil diperbarui')
    } else {
      await itemStore.create(payload as CreateItemPayload)
      toast.success('Item berhasil ditambahkan')
    }
    modalOpen.value = false
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menyimpan item')
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await itemStore.remove(deleteTarget.value.id)
    toast.success('Item berhasil dihapus')
    deleteTarget.value = null
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menghapus item')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AppTopbar title="Items">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Item</button>
      </template>
    </AppTopbar>

    <div class="page">
      <div class="page-toolbar">
        <input
          v-model="search"
          class="field-input page-search"
          type="text"
          placeholder="Cari nama atau kode aset…"
        />
        <div class="filters">
          <select v-model.number="categoryFilter" class="field-select filter-select">
            <option value="">Semua Kategori</option>
            <option v-for="c in categoryStore.items" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
          <select v-model="statusFilter" class="field-select filter-select">
            <option value="">Semua Status</option>
            <option v-for="s in ITEM_STATUSES" :key="s" :value="s">
              {{ presentStatus(s).label }}
            </option>
          </select>
        </div>
      </div>

      <div class="card">
        <p v-if="itemStore.loading" class="state-message">Memuat data…</p>
        <p v-else-if="itemStore.error" class="state-message is-error">
          {{ itemStore.error }}
        </p>
        <EmptyState
          v-else-if="filtered.length === 0"
          title="Belum ada item"
          description="Tambahkan item inventaris pertama Anda untuk mulai melacak aset."
        >
          <template #action>
            <button class="btn btn-primary" @click="openCreate">+ Tambah Item</button>
          </template>
        </EmptyState>
        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Kode Aset</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Brand</th>
                <th>Lokasi</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filtered"
                :key="item.id"
                class="row-clickable"
                @click="goToDetail(item)"
              >
                <td class="mono">{{ item.assetCode }}</td>
                <td>{{ item.name }}</td>
                <td class="table-muted">{{ categoryName(item.categoryId) }}</td>
                <td class="table-muted">{{ brandName(item.brandId) }}</td>
                <td class="table-muted">{{ locationName(item.locationId) }}</td>
                <td>
                  <StatusBadge
                    :label="presentCondition(item.itemCondition).label"
                    :tone="presentCondition(item.itemCondition).tone"
                  />
                </td>
                <td>
                  <StatusBadge
                    :label="presentStatus(item.itemStatus).label"
                    :tone="presentStatus(item.itemStatus).tone"
                  />
                </td>
                <td @click.stop>
                  <div class="table-actions">
                    <button class="btn btn-ghost btn-sm" @click="openEdit(item)">
                      Edit
                    </button>
                    <button class="btn btn-ghost btn-sm" @click="deleteTarget = item">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ItemFormModal
      :open="modalOpen"
      :editing="editing"
      :submitting="submitting"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDialog
      :open="!!deleteTarget"
      title="Hapus Item"
      :message="`Yakin ingin menghapus item &quot;${deleteTarget?.name}&quot;?`"
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: var(--space-2);
}
.filter-select {
  width: 180px;
}
.mono {
  font-family: var(--font-mono);
  font-size: 12px;
}
.row-clickable {
  cursor: pointer;
}
</style>
