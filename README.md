# SAQ Inventory System — Frontend

Frontend untuk **SAQ Inventory System Backend** (Go + Chi + SQLite).
Dibangun dengan **Vite + Vue 3 + TypeScript**, disusun dengan **clean
architecture**, dan **tanpa autentikasi** (mengikuti backend yang saat ini
juga belum punya middleware auth).

## Tech Stack

- Vue 3 (`<script setup>`, Composition API)
- TypeScript (strict)
- Vite
- Pinia (state management)
- Vue Router 4
- Axios

Tidak memakai UI framework/component library eksternal — semua komponen
dibuat sendiri di atas satu file palet warna (`theme.css`), supaya mudah
dikustomisasi tanpa terikat desain library tertentu.

## Arsitektur

```
src/
├── domain/                  # Lingkaran paling dalam. Murni TypeScript,
│   ├── entities/             # tidak boleh import axios/Vue/Pinia dsb.
│   └── repositories/        # Interface (kontrak), bukan implementasi.
│
├── application/
│   └── usecases/            # Logika aplikasi per entity (Brand, Item, dst).
│                             # Hanya bergantung pada interface di domain/.
│
├── infrastructure/
│   ├── http/                 # HttpClient (axios) + daftar endpoint.
│   ├── repositories/         # Implementasi konkret interface domain,
│   │                          # termasuk mapping snake_case (backend) ↔
│   │                          # camelCase (frontend).
│   └── container.ts          # Composition root: merangkai HttpClient →
│                              # repository konkret.
│
└── presentation/
    ├── stores/                # Pinia store, memanggil usecases (bukan
    │                          # repository/infrastructure langsung).
    ├── composables/           # mis. useToast
    ├── components/            # Komponen per-domain + komponen umum
    ├── views/                 # Halaman, dipasang lewat router
    ├── router/
    └── utils/                 # Util presentasi (format tanggal, label status)
```

Arah dependency: `presentation → application → domain ← infrastructure`.
`domain` tidak tahu apa-apa tentang HTTP atau Vue; `infrastructure`
mengimplementasikan kontrak yang didefinisikan `domain`. Kalau suatu saat
backend berganti (mis. REST → GraphQL, atau menambah auth), yang perlu
diubah cukup lapisan `infrastructure`, tanpa menyentuh `application` atau
`presentation`.

## Palet Tema

Satu-satunya acuan warna ada di `src/assets/styles/theme.css`, berupa CSS
custom properties (`--color-...`). Semua komponen memakai variabel ini,
bukan kode hex langsung — jadi mengganti mood tema cukup dilakukan di satu
file itu. Untuk melihat/preview seluruh palet secara visual, jalankan
aplikasi lalu buka menu **Palet Tema** di sidebar (`/theme`) — ada juga
toggle mode gelap di halaman itu untuk melihat pemetaan warna dark mode.

Struktur palet:
- **Neutral** (slate) — basis background/border/teks
- **Accent** (indigo) — tombol primer, link, item terpilih
- **Semantik** (success/warning/danger/info) — dipetakan ke kondisi &
  status item (`good/minor_damage/major_damage/lost`,
  `active/inactive/maintenance/borrowed`)

## Menjalankan

```bash
npm install
cp .env.example .env
npm run dev
```

Backend Go dijalankan terpisah di port `8080` (default). Dev server Vite
sudah dikonfigurasi proxy `/api/*` dan `/storage/*` ke
`http://localhost:8080` (lihat `vite.config.ts`) — ini supaya tidak perlu
menambahkan CORS middleware di backend saat development.

Untuk build production:

```bash
npm run build
```

Karena tidak ada proxy Vite saat production, set `VITE_API_BASE_URL` dan
`VITE_STORAGE_BASE_URL` di `.env` ke URL backend yang sebenarnya (dan
tambahkan middleware CORS di backend Go jika frontend di-deploy ke domain
berbeda).

## Catatan implementasi terkait backend

- **Tanpa auth**: tidak ada login/token, sesuai backend saat ini.
- **Metadata dinamis**: struktur metadata per kategori hanya bisa dibuat
  sekali (`POST /categories/{id}/metadata-structure`) — backend menolak
  jika kategori sudah punya struktur. Form "Metadata" di halaman Kategori
  otomatis jadi read-only kalau strukturnya sudah ada.
- **Field metadata pada item**: hanya bisa diisi saat **create** item baru
  (`CreateItemRequest.metadata`). Endpoint update item (`PUT /items/{id}`)
  di backend tidak menerima perubahan metadata, jadi form edit item tidak
  menampilkan field metadata sebagai input.
- **brand_id / location_id pada update item**: backend tidak bisa
  membedakan "field tidak dikirim" vs "field dikirim null" untuk kedua
  field ini (keduanya jadi nil pointer di Go), sehingga sekali terisi,
  keduanya hanya bisa diganti ke ID lain, tidak bisa dikosongkan lagi
  lewat form edit.
- **Upload gambar**: dua langkah sesuai desain backend — upload file ke
  `POST /images/upload` dulu (dapat `image_path`), baru daftarkan sebagai
  record lewat `POST /images` dengan `item_id`/`location_id`. Alur ini
  digabung jadi satu use case (`ImageUseCases.uploadAndAttach`) supaya
  komponen upload di UI tidak perlu tahu detail dua langkah tersebut.
