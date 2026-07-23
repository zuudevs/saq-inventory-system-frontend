<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
import StatusBadge from '@/presentation/components/common/StatusBadge.vue'
import { useItemStore } from '@/presentation/stores/item.store'
import { useCategoryStore } from '@/presentation/stores/category.store'
import { useBrandStore } from '@/presentation/stores/brand.store'
import { useLocationStore } from '@/presentation/stores/location.store'
import { presentStatus, formatDate } from '@/presentation/utils/itemPresentation'

const router = useRouter()
const itemStore = useItemStore()
const categoryStore = useCategoryStore()
const brandStore = useBrandStore()
const locationStore = useLocationStore()

onMounted(() => {
  itemStore.fetchAll()
  categoryStore.fetchAll()
  brandStore.fetchAll()
  locationStore.fetchAll()
})

const summaryCards = computed(() => [
  { label: 'Total Item', value: itemStore.items.length, to: '/items' },
  { label: 'Kategori', value: categoryStore.items.length, to: '/categories' },
  { label: 'Brand', value: brandStore.items.length, to: '/brands' },
  { label: 'Lokasi', value: locationStore.items.length, to: '/locations' },
])

const recentItems = computed(() =>
  [...itemStore.items]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 6),
)
</script>

<template>
  <div>
    <AppTopbar title="Dashboard" />

    <div class="page">
      <div class="summary-grid">
        <RouterLink
          v-for="card in summaryCards"
          :key="card.label"
          :to="card.to"
          class="summary-card"
        >
          <p class="summary-value">{{ card.value }}</p>
          <p class="summary-label">{{ card.label }}</p>
        </RouterLink>
      </div>

      <div class="card card-padded">
        <div class="section-header">
          <p class="section-label">Item Terbaru</p>
          <button class="btn btn-ghost btn-sm" @click="router.push('/items')">
            Lihat semua
          </button>
        </div>

        <p v-if="itemStore.loading" class="state-message">Memuat…</p>
        <p v-else-if="recentItems.length === 0" class="state-message">
          Belum ada item yang ditambahkan.
        </p>
        <ul v-else class="recent-list">
          <li
            v-for="item in recentItems"
            :key="item.id"
            class="recent-row"
            @click="router.push(`/items/${item.id}`)"
          >
            <div>
              <p class="recent-name">{{ item.name }}</p>
              <p class="recent-meta">{{ item.assetCode }} · {{ formatDate(item.createdAt) }}</p>
            </div>
            <StatusBadge
              :label="presentStatus(item.itemStatus).label"
              :tone="presentStatus(item.itemStatus).tone"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  color: inherit;
}
.summary-card:hover {
  text-decoration: none;
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
}

.summary-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
}
.summary-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
}

.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.recent-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}
.recent-row:last-child {
  border-bottom: none;
}
.recent-row:hover .recent-name {
  color: var(--color-primary);
}

.recent-name {
  font-size: 13px;
  font-weight: 500;
}
.recent-meta {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
