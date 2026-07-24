<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import EmptyState from '@/presentation/components/common/EmptyState.vue'
import ConfirmDialog from '@/presentation/components/common/ConfirmDialog.vue'
import Modal from '@/presentation/components/common/Modal.vue'
import LocationFormModal from '@/presentation/components/location/LocationFormModal.vue'
import ImageGallery from '@/presentation/components/image/ImageGallery.vue'
import { useLocationStore } from '@/presentation/stores/location.store'
import { useToast } from '@/presentation/composables/useToast'
import { DomainError } from '@/domain/entities/common'
import type { Location } from '@/domain/entities/Location'

const store = useLocationStore()
const toast = useToast()

const search = ref('')
const modalOpen = ref(false)
const editing = ref<Location | null>(null)
const submitting = ref(false)
const deleteTarget = ref<Location | null>(null)
const deleting = ref(false)
const galleryTarget = ref<Location | null>(null)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return store.items
  return store.items.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      (l.roomCode ?? '').toLowerCase().includes(q),
  )
})

onMounted(() => store.fetchAll())

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(location: Location) {
  editing.value = location
  modalOpen.value = true
}

async function handleSubmit(payload: {
  name: string
  roomCode?: string
  description?: string
}) {
  submitting.value = true
  try {
    if (editing.value) {
      await store.update(editing.value.id, payload)
      toast.success('Lokasi berhasil diperbarui')
    } else {
      await store.create(payload)
      toast.success('Lokasi berhasil ditambahkan')
    }
    modalOpen.value = false
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menyimpan lokasi')
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.remove(deleteTarget.value.id)
    toast.success('Lokasi berhasil dihapus')
    deleteTarget.value = null
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menghapus lokasi')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AppTopbar title="Lokasi">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Lokasi</button>
      </template>
    </AppTopbar>

    <div class="page">
      <div class="page-toolbar">
        <input
          v-model="search"
          class="field-input page-search"
          type="text"
          placeholder="Cari lokasi atau kode ruangan…"
        />
      </div>

      <div class="card">
        <p v-if="store.loading" class="state-message">Memuat data…</p>
        <p v-else-if="store.error" class="state-message is-error">{{ store.error }}</p>
        <EmptyState
          v-else-if="filtered.length === 0"
          title="Belum ada lokasi"
          description="Tambahkan lokasi untuk menandai di mana aset/item disimpan."
        >
          <template #action>
            <button class="btn btn-primary" @click="openCreate">
              + Tambah Lokasi
            </button>
          </template>
        </EmptyState>
        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kode Ruangan</th>
                <th>Deskripsi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="location in filtered" :key="location.id">
                <td>{{ location.name }}</td>
                <td class="table-muted">{{ location.roomCode || '—' }}</td>
                <td class="table-muted">{{ location.description || '—' }}</td>
                <td>
                  <div class="table-actions">
                    <button
                      class="btn btn-ghost btn-sm"
                      @click="galleryTarget = location"
                    >
                      Galeri Foto
                    </button>
                    <button class="btn btn-ghost btn-sm" @click="openEdit(location)">
                      Edit
                    </button>
                    <button
                      class="btn btn-ghost btn-sm"
                      @click="deleteTarget = location"
                    >
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

    <LocationFormModal
      :open="modalOpen"
      :editing="editing"
      :submitting="submitting"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <Modal
      :open="!!galleryTarget"
      :title="`Galeri Foto - ${galleryTarget?.name}`"
      @close="galleryTarget = null"
    >
      <ImageGallery v-if="galleryTarget" :location-id="galleryTarget.id" />
    </Modal>

    <ConfirmDialog
      :open="!!deleteTarget"
      title="Hapus Lokasi"
      :message="`Yakin ingin menghapus lokasi &quot;${deleteTarget?.name}&quot;?`"
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.table-actions {
  display: flex;
  gap: var(--space-1);
}
</style>
