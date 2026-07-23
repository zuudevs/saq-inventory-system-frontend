<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title: string
    maxWidth?: string
  }>(),
  { maxWidth: '480px' },
)

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-card" :style="{ maxWidth }">
          <header class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button
              class="modal-close"
              type="button"
              aria-label="Tutup"
              @click="emit('close')"
            >
              ✕
            </button>
          </header>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 100;
}

.modal-card {
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-surface);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 14px;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}
.modal-close:hover {
  background: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-6);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
