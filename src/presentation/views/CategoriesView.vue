<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import EmptyState from '@/presentation/components/common/EmptyState.vue'
import ConfirmDialog from '@/presentation/components/common/ConfirmDialog.vue'
import CategoryFormModal from '@/presentation/components/category/CategoryFormModal.vue'
import MetadataStructureEditor from '@/presentation/components/metadataStructure/MetadataStructureEditor.vue'
import { useCategoryStore } from '@/presentation/stores/category.store'
import { useToast } from '@/presentation/composables/useToast'
import { DomainError } from '@/domain/entities/common'
import type { Category } from '@/domain/entities/Category'

const store = useCategoryStore()
const toast = useToast()

const search = ref('')
const modalOpen = ref(false)
const editing = ref<Category | null>(null)
const submitting = ref(false)
const deleteTarget = ref<Category | null>(null)
const deleting = ref(false)
const metadataTarget = ref<Category | null>(null)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return store.items
  return store.items.filter((c) => c.name.toLowerCase().includes(q))
})

onMounted(() => store.fetchAll())

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(category: Category) {
  editing.value = category
  modalOpen.value = true
}

async function handleSubmit(payload: { name: string; description?: string }) {
  submitting.value = true
  try {
    if (editing.value) {
      await store.update(editing.value.id, payload)
      toast.success('Kategori berhasil diperbarui')
    } else {
      await store.create(payload)
      toast.success('Kategori berhasil ditambahkan')
    }
    modalOpen.value = false
  } catch (err) {
    toast.error(
      err instanceof DomainError ? err.message : 'Gagal menyimpan kategori',
    )
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.remove(deleteTarget.value.id)
    toast.success('Kategori berhasil dihapus')
    deleteTarget.value = null
  } catch (err) {
    toast.error(
      err instanceof DomainError ? err.message : 'Gagal menghapus kategori',
    )
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <AppTopbar title="Kategori">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">
          + Tambah Kategori
        </button>
      </template>
    </AppTopbar>

    <div class="page">
      <div class="page-toolbar">
        <input
          v-model="search"
          class="field-input page-search"
          type="text"
          placeholder="Cari kategori…"
        />
      </div>

      <div class="card">
        <p v-if="store.loading" class="state-message">Memuat data…</p>
        <p v-else-if="store.error" class="state-message is-error">{{ store.error }}</p>
        <EmptyState
          v-else-if="filtered.length === 0"
          title="Belum ada kategori"
          description="Kategori dipakai untuk mengelompokkan item dan mendefinisikan field metadata khusus."
        >
          <template #action>
            <button class="btn btn-primary" @click="openCreate">
              + Tambah Kategori
            </button>
          </template>
        </EmptyState>
        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Slug</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in filtered" :key="category.id">
                <td>{{ category.name }}</td>
                <td class="table-muted">{{ category.description || '—' }}</td>
                <td class="table-muted">{{ category.slug }}</td>
                <td>
                  <div class="table-actions">
                    <button
                      class="btn btn-ghost btn-sm"
                      @click="metadataTarget = category"
                    >
                      Metadata
                    </button>
                    <button class="btn btn-ghost btn-sm" @click="openEdit(category)">
                      Edit
                    </button>
                    <button
                      class="btn btn-ghost btn-sm"
                      @click="deleteTarget = category"
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

    <CategoryFormModal
      :open="modalOpen"
      :editing="editing"
      :submitting="submitting"
      @close="modalOpen = false"
      @submit="handleSubmit"
    />

    <MetadataStructureEditor
      :open="!!metadataTarget"
      :category="metadataTarget"
      @close="metadataTarget = null"
    />

    <ConfirmDialog
      :open="!!deleteTarget"
      title="Hapus Kategori"
      :message="`Yakin ingin menghapus kategori &quot;${deleteTarget?.name}&quot;? Item yang memakai kategori ini bisa terpengaruh.`"
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
