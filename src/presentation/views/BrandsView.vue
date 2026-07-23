<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import EmptyState from '@/presentation/components/common/EmptyState.vue'
import ConfirmDialog from '@/presentation/components/common/ConfirmDialog.vue'
import BrandFormModal from '@/presentation/components/brand/BrandFormModal.vue'
import { useBrandStore } from '@/presentation/stores/brand.store'
import { useToast } from '@/presentation/composables/useToast'
import { formatDate } from '@/presentation/utils/itemPresentation'
import { DomainError } from '@/domain/entities/common'
import type { Brand } from '@/domain/entities/Brand'

const store = useBrandStore()
const toast = useToast()

const search = ref('')
const modalOpen = ref(false)
const editing = ref<Brand | null>(null)
const submitting = ref(false)
const deleteTarget = ref<Brand | null>(null)
const deleting = ref(false)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return store.items
  return store.items.filter((b) => b.name.toLowerCase().includes(q))
})

onMounted(() => store.fetchAll())

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(brand: Brand) {
  editing.value = brand
  modalOpen.value = true
}

async function handleSubmit(name: string) {
  submitting.value = true
  try {
    if (editing.value) {
      await store.update(editing.value.id, { name })
      toast.success('Brand berhasil diperbarui')
    } else {
      await store.create({ name })
      toast.success('Brand berhasil ditambahkan')
    }
    modalOpen.value = false
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menyimpan brand')
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.remove(deleteTarget.value.id)
    toast.success('Brand berhasil dihapus')
    deleteTarget.value = null
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menghapus brand')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AppTopbar title="Brand">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Brand</button>
      </template>
    </AppTopbar>

    <div class="page">
      <div class="page-toolbar">
        <input
          v-model="search"
          class="field-input page-search"
          type="text"
          placeholder="Cari brand…"
        />
      </div>

      <div class="card">
        <p v-if="store.loading" class="state-message">Memuat data…</p>
        <p v-else-if="store.error" class="state-message is-error">{{ store.error }}</p>
        <EmptyState
          v-else-if="filtered.length === 0"
          title="Belum ada brand"
          description="Tambahkan brand untuk mulai mengelompokkan item berdasarkan mereknya."
        >
          <template #action>
            <button class="btn btn-primary" @click="openCreate">+ Tambah Brand</button>
          </template>
        </EmptyState>
        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Slug</th>
                <th>Dibuat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="brand in filtered" :key="brand.id">
                <td>{{ brand.name }}</td>
                <td class="table-muted">{{ brand.slug }}</td>
                <td class="table-muted">{{ formatDate(brand.createdAt) }}</td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-ghost btn-sm" @click="openEdit(brand)">
                      Edit
                    </button>
                    <button
                      class="btn btn-ghost btn-sm"
                      @click="deleteTarget = brand"
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

    <BrandFormModal
      :open="modalOpen"
      :editing="editing"
      :submitting="submitting"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <ConfirmDialog
      :open="!!deleteTarget"
      title="Hapus Brand"
      :message="`Yakin ingin menghapus brand &quot;${deleteTarget?.name}&quot;? Tindakan ini tidak bisa dibatalkan.`"
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
