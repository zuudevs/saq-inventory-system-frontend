<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message: string
    confirmLabel?: string
    danger?: boolean
    loading?: boolean
  }>(),
  {
    title: 'Konfirmasi',
    confirmLabel: 'Ya, lanjutkan',
    danger: true,
    loading: false,
  },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="overlay" @click.self="emit('cancel')">
        <div class="card">
          <h2 class="title">{{ title }}</h2>
          <p class="message">{{ message }}</p>
          <div class="actions">
            <button
              type="button"
              class="btn btn-ghost"
              :disabled="loading"
              @click="emit('cancel')"
            >
              Batal
            </button>
            <button
              type="button"
              :class="['btn', danger ? 'btn-danger' : 'btn-primary']"
              :disabled="loading"
              @click="emit('confirm')"
            >
              {{ loading ? 'Memproses…' : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 200;
}

.card {
  width: 100%;
  max-width: 380px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-6);
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.message {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
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
