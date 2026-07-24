<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

defineProps<{ title: string }>()

const darkMode = ref(false)

onMounted(() => {
  darkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
})

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  const theme = darkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>

<template>
  <header class="topbar">
    <h1 class="page-title">{{ title }}</h1>
    <div class="topbar-actions">
      <button 
        class="btn btn-ghost theme-toggle-btn" 
        @click="toggleDarkMode" 
        :title="darkMode ? 'Mode Terang' : 'Mode Gelap'"
        aria-label="Toggle dark mode"
      >
        <component :is="darkMode ? Sun : Moon" :size="16" :stroke-width="2" />
      </button>
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
  align-items: center;
  gap: var(--space-2);
}

.theme-toggle-btn {
  padding: 8px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.theme-toggle-btn:hover {
  color: var(--color-text-primary);
}
</style>
