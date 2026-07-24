<script setup lang="ts">
import {
  ArrowUpDown,
  Boxes,
  LayoutDashboard,
  MapPin,
  Package,
  Tags,
} from "lucide-vue-next"
import SaqBrand from "@/assets/icons/saq-brand.svg";

interface NavItem {
  to: string
  label: string
  icon: any
}

const navItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/items",
    label: "Items",
    icon: Package,
  },
  {
    to: "/categories",
    label: "Kategori",
    icon: Boxes,
  },
  {
    to: "/brands",
    label: "Brand",
    icon: Tags,
  },
  {
    to: "/locations",
    label: "Lokasi",
    icon: MapPin,
  },
  {
    to: "/export-import",
    label: "Import & Export",
    icon: ArrowUpDown,
  },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">
        <SaqBrand class="brand-logo" />
      </div>

      <div class="brand-text">
        <h1>SAQ Inventory</h1>
        <p>Sistem Manajemen Aset</p>
      </div>
    </div>

    <nav class="nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        active-class="nav-link-active"
        exact-active-class="nav-link-active"
      >
        <component
          :is="item.icon"
          class="nav-icon"
          :size="18"
          :stroke-width="2"
        />

        <span>
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;

  position: sticky;
  top: 0;

  display: flex;
  flex-direction: column;

  background: var(--color-surface);

  border-right: 1px solid var(--color-border);
}

/* ===========================
   BRAND
=========================== */

.brand {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 22px;

  border-bottom: 1px solid var(--color-border);
}

.brand-mark {
  width: 42px;
  height: 42px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: none;

  color: white;
}

.brand-logo {
  width: 100%;
  height: 100%;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-text h1 {
  margin: 0;

  font-size: 15px;
  font-weight: 700;

  color: var(--color-text-primary);
}

.brand-text p {
  margin: 2px 0 0;

  font-size: 12px;

  color: var(--color-text-muted);
}

/* ===========================
   NAVIGATION
=========================== */

.nav {
  flex: 1;

  padding: 14px;

  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-link {
  position: relative;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 11px 14px;

  border-radius: 12px;

  color: var(--color-text-secondary);

  font-size: 14px;
  font-weight: 500;

  transition:
    background .2s ease,
    color .2s ease,
    transform .2s ease;
}

.nav-link:hover {
  background: var(--color-surface-hover);

  color: var(--color-text-primary);

  text-decoration: none;
}

.nav-link:hover .nav-icon {
  transform: scale(1.08);
}

.nav-link-active {
  background: var(--color-primary-subtle);

  color: var(--color-primary);

  font-weight: 600;
}

.nav-link-active::before {
  content: "";

  position: absolute;

  left: -14px;

  width: 4px;
  height: 22px;

  border-radius: 999px;

  background: var(--color-primary);
}

.nav-icon {
  flex-shrink: 0;

  transition: transform .2s ease;
}
</style>