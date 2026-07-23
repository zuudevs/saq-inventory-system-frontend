# Panduan Desain SAQ Inventory System

Dokumen ini menjelaskan acuan warna, tipografi, radius, shadow, spacing, dan penggunaan komponen di dalam aplikasi **SAQ Inventory System**.

## 1. Tema Warna (Design Tokens)

Seluruh warna dalam aplikasi dikelola melalui CSS Custom Properties di `src/assets/styles/theme.css`.

### Warna Netral (Slate)
Digunakan sebagai basis UI (background, border, teks).
- `var(--color-neutral-0)` (#ffffff) - Background permukaan terang
- `var(--color-neutral-50)` (#f8fafc) - Background halaman terang
- `var(--color-neutral-100)` (#f1f5f9) - Hover permukaan
- `var(--color-neutral-200)` (#e2e8f0) - Border biasa
- `var(--color-neutral-300)` (#cbd5e1) - Border kuat / ikon
- `var(--color-neutral-400)` (#94a3b8) - Teks redup (muted)
- `var(--color-neutral-600)` (#475569) - Teks sekunder
- `var(--color-neutral-900)` (#0f172a) - Teks utama
- `var(--color-neutral-950)` (#020617) - Background halaman gelap

### Warna Aksen (Indigo)
Digunakan untuk aksi utama, tombol primer, link, dan item yang terpilih.
- `var(--color-accent-500)` (#6366f1) - Warna primer (Dark Mode)
- `var(--color-accent-600)` (#4f46e5) - Warna primer (Light Mode)

### Warna Semantik (Status)
Dipetakan ke status item:
- **Success** (Hijau): Status `Aktif`, `Good`
  - `var(--color-success-500)` (#22c55e)
- **Warning** (Kuning): Status `Maintenance`, `Minor Damage`
  - `var(--color-warning-500)` (#f59e0b)
- **Danger** (Merah): Status `Hilang`, `Major Damage`
  - `var(--color-danger-500)` (#ef4444)
- **Info** (Biru): Status `Dipinjam`, `Borrowed`
  - `var(--color-info-500)` (#0ea5e9)

---

## 2. Tipografi

Aplikasi ini menggunakan font keluarga Sans-Serif sebagai font utama dan Monospace untuk kode/data teknis.
- **Sans-Serif**: `Inter`, system-ui, -apple-system, sans-serif
- **Monospace**: `JetBrains Mono`, ui-monospace, monospace

---

## 3. Spacing & Layout

Jarak antar elemen didefinisikan menggunakan variabel spacing berikut:
- `--space-1` (4px)
- `--space-2` (8px)
- `--space-3` (12px)
- `--space-4` (16px)
- `--space-6` (24px)
- `--space-8` (32px)

---

## 4. Efek & Sudut (Radius & Shadows)

- **Radius**:
  - `--radius-sm`: 6px (Tombol, input)
  - `--radius-md`: 10px (Card kecil, swatch)
  - `--radius-lg`: 16px (Card besar, modal)
- **Shadow**:
  - `--shadow-sm`: `0 1px 2px 0 rgb(15 23 42 / 0.06)`
  - `--shadow-md`: `0 4px 6px -1px rgb(15 23 42 / 0.08)`
