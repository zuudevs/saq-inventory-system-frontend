<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="wrap">
    <p class="code">404</p>
    <h2 class="title">Halaman tidak ditemukan</h2>
    <button class="btn btn-primary" @click="router.push('/')">
      Kembali ke Dashboard
    </button>
  </div>
</template>

<style scoped>
.wrap {
  min-height: calc(100vh - var(--topbar-height));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  text-align: center;
}
.code {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-text-muted);
}
.title {
  font-size: 16px;
  margin-bottom: var(--space-3);
}
</style>
