/**
 * Path endpoint backend, disatukan di sini supaya kalau ada perubahan
 * routing (lihat internal/routes/routes.go) cukup diubah di satu tempat.
 */
export const endpoints = {
  brands: '/brands',
  brand: (id: number | string) => `/brands/${id}`,

  categories: '/categories',
  category: (id: number | string) => `/categories/${id}`,
  metadataStructure: (categoryId: number | string) =>
    `/categories/${categoryId}/metadata-structure`,

  locations: '/locations',
  location: (id: number | string) => `/locations/${id}`,

  items: '/items',
  item: (id: number | string) => `/items/${id}`,

  images: '/images',
  image: (id: number | string) => `/images/${id}`,
  imageUpload: '/images/upload',

  exportsCsv: '/exports/csv',
  exportsXlsx: '/exports/xlsx',
  importsXlsx: '/imports/xlsx',

  health: '/health',
}
