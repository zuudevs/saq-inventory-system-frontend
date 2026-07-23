<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import StatusBadge from '@/presentation/components/common/StatusBadge.vue'
import ImageGallery from '@/presentation/components/image/ImageGallery.vue'
import { useItemStore } from '@/presentation/stores/item.store'
import { useBrandStore } from '@/presentation/stores/brand.store'
import { useCategoryStore } from '@/presentation/stores/category.store'
import { useLocationStore } from '@/presentation/stores/location.store'
import { useMetadataStructureStore } from '@/presentation/stores/metadataStructure.store'
import { presentCondition, presentStatus, formatDate } from '@/presentation/utils/itemPresentation'

const route = useRoute()
const router = useRouter()

const itemStore = useItemStore()
const brandStore = useBrandStore()
const categoryStore = useCategoryStore()
const locationStore = useLocationStore()
const metadataStore = useMetadataStructureStore()

const itemId = computed(() => Number(route.params.id))
const item = computed(() => itemStore.byId(itemId.value))

const brand = computed(() =>
  item.value?.brandId ? brandStore.byId(item.value.brandId) : null,
)
const category = computed(() =>
  item.value ? categoryStore.byId(item.value.categoryId) : null,
)
const location = computed(() =>
  item.value?.locationId ? locationStore.byId(item.value.locationId) : null,
)

const metadataFields = computed(() => {
  if (!item.value) return []
  return metadataStore.byCategoryId[item.value.categoryId]?.fields ?? []
})

onMounted(async () => {
  await itemStore.fetchOne(itemId.value)
  if (!brandStore.items.length) brandStore.fetchAll()
  if (!categoryStore.items.length) categoryStore.fetchAll()
  if (!locationStore.items.length) locationStore.fetchAll()
  if (item.value) await metadataStore.fetchForCategory(item.value.categoryId)
})
</script>

<template>
  <div>
    <AppTopbar :title="item ? item.name : 'Detail Item'">
      <template #actions>
        <button class="btn btn-ghost" @click="router.push('/items')">
          ← Kembali
        </button>
      </template>
    </AppTopbar>

    <div v-if="!item" class="page">
      <p class="state-message">Memuat item…</p>
    </div>

    <div v-else class="page detail-grid">
      <div class="card card-padded main-col">
        <div class="header-row">
          <div>
            <p class="asset-code">{{ item.assetCode }}</p>
            <h2 class="item-name">{{ item.name }}</h2>
          </div>
          <div class="badges">
            <StatusBadge
              :label="presentCondition(item.itemCondition).label"
              :tone="presentCondition(item.itemCondition).tone"
            />
            <StatusBadge
              :label="presentStatus(item.itemStatus).label"
              :tone="presentStatus(item.itemStatus).tone"
            />
          </div>
        </div>

        <dl class="detail-list">
          <div class="detail-row">
            <dt>Kategori</dt>
            <dd>{{ category?.name ?? '—' }}</dd>
          </div>
          <div class="detail-row">
            <dt>Brand</dt>
            <dd>{{ brand?.name ?? '—' }}</dd>
          </div>
          <div class="detail-row">
            <dt>Lokasi</dt>
            <dd>{{ location?.name ?? '—' }}</dd>
          </div>
          <div class="detail-row">
            <dt>Catatan</dt>
            <dd>{{ item.notes || '—' }}</dd>
          </div>
          <div class="detail-row">
            <dt>Dibuat</dt>
            <dd>{{ formatDate(item.createdAt) }}</dd>
          </div>
          <div class="detail-row">
            <dt>Diperbarui</dt>
            <dd>{{ formatDate(item.updatedAt) }}</dd>
          </div>
        </dl>

        <template v-if="metadataFields.length > 0">
          <hr class="divider" />
          <p class="section-label">Metadata Kategori</p>
          <dl class="detail-list">
            <div v-for="mf in metadataFields" :key="mf.name" class="detail-row">
              <dt>{{ mf.label }}</dt>
              <dd>{{ item.metadata?.[mf.name] ?? '—' }}</dd>
            </div>
          </dl>
        </template>
      </div>

      <div class="card card-padded side-col">
        <ImageGallery :item-id="item.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-5);
}

.asset-code {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}
.item-name {
  font-size: 20px;
  font-weight: 600;
}

.badges {
  display: flex;
  gap: var(--space-2);
}

.detail-list {
  display: grid;
  gap: var(--space-3);
}
.detail-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  font-size: 13px;
}
.detail-row dt {
  color: var(--color-text-muted);
}
.detail-row dd {
  margin: 0;
  color: var(--color-text-primary);
}

.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-5) 0;
}
.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
