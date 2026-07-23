import { reactive } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

// State modul-level (bukan di dalam fungsi) supaya semua pemanggil
// useToast() di komponen manapun berbagi satu daftar toast yang sama.
const toasts = reactive<ToastItem[]>([])
let nextId = 1

function push(message: string, variant: ToastVariant, timeoutMs = 4000) {
  const id = nextId++
  toasts.push({ id, message, variant })
  window.setTimeout(() => dismiss(id), timeoutMs)
}

function dismiss(id: number) {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

export function useToast() {
  return {
    toasts,
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
    info: (message: string) => push(message, 'info'),
    dismiss,
  }
}
