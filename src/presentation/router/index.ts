import { createRouter, createWebHistory } from 'vue-router'
import AppShell from '@/presentation/components/layout/AppShell.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppShell,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/presentation/views/DashboardView.vue'),
        },
        {
          path: 'items',
          name: 'items',
          component: () => import('@/presentation/views/ItemsView.vue'),
        },
        {
          path: 'items/:id',
          name: 'item-detail',
          component: () => import('@/presentation/views/ItemDetailView.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/presentation/views/CategoriesView.vue'),
        },
        {
          path: 'brands',
          name: 'brands',
          component: () => import('@/presentation/views/BrandsView.vue'),
        },
        {
          path: 'locations',
          name: 'locations',
          component: () => import('@/presentation/views/LocationsView.vue'),
        },
        {
          path: 'export-import',
          name: 'export-import',
          component: () => import('@/presentation/views/ExportImportView.vue'),
        },
        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/presentation/views/NotFoundView.vue'),
        },
      ],
    },
  ],
})

export default router
