<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="topbar">
    <h1 class="page-title">{{ title }}</h1>
    <div class="topbar-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
}

.topbar-actions {
  display: flex;
  gap: var(--space-2);
}
</style>
