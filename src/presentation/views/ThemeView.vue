<script setup lang="ts">
	import { ref } from 'vue'
	import { Moon, Sun } from "lucide-vue-next"
	import AppTopbar from '@/presentation/components/layout/AppTopbar.vue'
	import StatusBadge from '@/presentation/components/common/StatusBadge.vue'

	const darkMode = ref(false)

	function toggleDarkMode() {
		darkMode.value = !darkMode.value
		document.documentElement.setAttribute(
			'data-theme',
			darkMode.value ? 'dark' : 'light',
		)
	}

	const neutralScale = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
	const accentScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

	const semanticGroups: { title: string; prefix: string }[] = [
		{ title: 'Success', prefix: 'success' },
		{ title: 'Warning', prefix: 'warning' },
		{ title: 'Danger', prefix: 'danger' },
		{ title: 'Info', prefix: 'info' },
	]
</script>

<template>
	<div>
		<AppTopbar title="Palet Tema">
			<template #actions>
				<button class="btn btn-ghost theme-toggle" @click="toggleDarkMode">
					<component :is="darkMode ? Sun : Moon" :size="16" :stroke-width="2" />

					<span>
						{{ darkMode ? "Mode Terang" : "Mode Gelap" }}
					</span>
				</button>
			</template>
		</AppTopbar>

		<div class="page">
			<p class="intro">
				Ini adalah acuan warna tunggal aplikasi, didefinisikan sebagai CSS
				custom properties di <code>src/assets/styles/theme.css</code>. Semua
				komponen memakai variabel ini (bukan kode hex langsung), jadi
				mengganti mood tema cukup dilakukan di satu file tersebut.
			</p>

			<section class="section">
				<h3 class="section-title">Neutral — basis UI</h3>
				<div class="swatch-row">
					<div v-for="n in neutralScale" :key="n" class="swatch">
						<div class="swatch-color" :style="{ background: `var(--color-neutral-${n})` }" />
						<span class="swatch-label">{{ n }}</span>
					</div>
				</div>
			</section>

			<section class="section">
				<h3 class="section-title">Accent — aksi utama</h3>
				<div class="swatch-row">
					<div v-for="n in accentScale" :key="n" class="swatch">
						<div class="swatch-color" :style="{ background: `var(--color-accent-${n})` }" />
						<span class="swatch-label">{{ n }}</span>
					</div>
				</div>
			</section>

			<section class="section">
				<h3 class="section-title">Semantik — status item</h3>
				<div v-for="group in semanticGroups" :key="group.prefix" class="semantic-block">
					<p class="semantic-title">{{ group.title }}</p>
					<div class="swatch-row">
						<div v-for="n in [50, 100, 500, 600, 700]" :key="n" class="swatch">
							<div class="swatch-color" :style="{ background: `var(--color-${group.prefix}-${n})` }" />
							<span class="swatch-label">{{ n }}</span>
						</div>
					</div>
				</div>
			</section>

			<section class="section">
				<h3 class="section-title">Contoh badge status item</h3>
				<div class="badge-demo">
					<StatusBadge label="Aktif" tone="success" />
					<StatusBadge label="Maintenance" tone="warning" />
					<StatusBadge label="Hilang" tone="danger" />
					<StatusBadge label="Dipinjam" tone="info" />
					<StatusBadge label="Tidak Aktif" tone="neutral" />
				</div>
			</section>

			<section class="section">
				<h3 class="section-title">Contoh komponen</h3>
				<div class="card card-padded component-demo">
					<div class="demo-row">
						<button class="btn btn-primary">Tombol Primer</button>
						<button class="btn btn-ghost">Tombol Ghost</button>
						<button class="btn btn-danger">Tombol Danger</button>
					</div>
					<div class="field demo-field">
						<label class="field-label">Contoh input</label>
						<input class="field-input" placeholder="Ketik sesuatu…" />
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<style scoped>
	.intro {
		color: var(--color-text-secondary);
		max-width: 640px;
		margin-bottom: var(--space-8);
		line-height: 1.7;
	}

	.intro code {
		background: var(--color-neutral-100);
		padding: 2px 6px;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 12px;
	}

	.section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: var(--space-4);
	}

	.swatch-row {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.swatch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.swatch-color {
		width: 56px;
		height: 56px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.swatch-label {
		font-size: 11px;
		color: var(--color-text-muted);
		font-family: var(--font-mono);
	}

	.semantic-block {
		margin-bottom: var(--space-4);
	}

	.semantic-title {
		font-size: 12px;
		font-weight: 500;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-2);
	}

	.badge-demo {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.demo-row {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.demo-field {
		max-width: 280px;
		margin-bottom: 0;
	}
</style>
