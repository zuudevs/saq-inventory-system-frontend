<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const props = withDefaults(
  defineProps<{
    label: string
    tone?: Tone
  }>(),
  { tone: 'neutral' },
)

const toneClass = computed(() => `badge badge-${props.tone}`)
</script>

<template>
  <span :class="toneClass">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.6;
  white-space: nowrap;
}

.badge-success {
  background: var(--color-success-100);
  color: var(--color-success-700);
}
.badge-warning {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
}
.badge-danger {
  background: var(--color-danger-100);
  color: var(--color-danger-700);
}
.badge-info {
  background: var(--color-info-100);
  color: var(--color-info-700);
}
.badge-neutral {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
}
</style>
