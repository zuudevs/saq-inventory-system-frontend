<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useImageStore } from '@/presentation/stores/image.store'
import { useToast } from '@/presentation/composables/useToast'
import { DomainError } from '@/domain/entities/common'
import type { ID } from '@/domain/entities/common'

const props = defineProps<{ itemId: ID }>()

const store = useImageStore()
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)

const storageBase = import.meta.env.VITE_STORAGE_BASE_URL || '/storage'

function resolveUrl(imagePath: string): string {
  return `${storageBase}/${imagePath}`
}

onMounted(() => store.fetchForItem(props.itemId))

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const gallery = store.byItemId[props.itemId] ?? []
    await store.uploadForItem(props.itemId, file, gallery.length === 0)
    toast.success('Gambar berhasil diunggah')
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal mengunggah gambar')
  } finally {
    input.value = ''
  }
}

async function handleSetPrimary(imageId: ID) {
  try {
    await store.setPrimary(props.itemId, imageId)
  } catch (err) {
    toast.error(
      err instanceof DomainError ? err.message : 'Gagal menjadikan gambar utama',
    )
  }
}

async function handleRemove(imageId: ID) {
  try {
    await store.remove(props.itemId, imageId)
    toast.success('Gambar berhasil dihapus')
  } catch (err) {
    toast.error(err instanceof DomainError ? err.message : 'Gagal menghapus gambar')
  }
}
</script>

<template>
  <div>
    <div class="gallery-header">
      <p class="section-label">Galeri Foto</p>
      <button
        class="btn btn-ghost btn-sm"
        :disabled="store.uploading"
        @click="triggerUpload"
      >
        {{ store.uploading ? 'Mengunggah…' : '+ Unggah Foto' }}
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        @change="handleFileChange"
      />
    </div>

    <p v-if="store.loading" class="state-message">Memuat galeri…</p>
    <p
      v-else-if="!store.byItemId[itemId] || store.byItemId[itemId].length === 0"
      class="state-message"
    >
      Belum ada foto untuk item ini.
    </p>
    <div v-else class="grid">
      <div
        v-for="image in store.byItemId[itemId]"
        :key="image.id"
        class="thumb"
      >
        <img :src="resolveUrl(image.imagePath)" :alt="`Foto item #${image.id}`" />
        <span v-if="image.isPrimary" class="primary-badge">Utama</span>
        <div class="thumb-actions">
          <button
            v-if="!image.isPrimary"
            class="mini-btn"
            title="Jadikan foto utama"
            @click="handleSetPrimary(image.id)"
          >
            ★
          </button>
          <button class="mini-btn mini-btn-danger" title="Hapus" @click="handleRemove(image.id)">
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}
.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-3);
}

.thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-neutral-100);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.primary-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: var(--color-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.thumb-actions {
  position: absolute;
  bottom: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.thumb:hover .thumb-actions {
  opacity: 1;
}

.mini-btn {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  border: none;
  background: rgb(15 23 42 / 0.7);
  color: #fff;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mini-btn-danger:hover {
  background: var(--color-danger-600);
}
</style>
