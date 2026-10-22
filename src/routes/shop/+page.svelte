<script lang="ts">
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import type { ActionData, PageData } from './$types';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	let { data }: { data: PageData; form: ActionData } = $props();

	let inputSearch = $state('');
	let selectedCategory = $state('all');
	let sortBy = $state<'popular' | 'price-asc' | 'price-desc'>('popular');

	// Client-side instant filter and sort for ultra-responsive UX
	let filteredItems = $derived.by(() => {
		let list = [...data.colla];

		// Filter by category
		if (selectedCategory !== 'all') {
			const cat = data.catta.find((c) => c.title === selectedCategory);
			if (cat && 'id' in cat) {
				list = list.filter((item: any) => item.catId === cat.id);
			}
		}

		// Filter by search query
		if (inputSearch.trim()) {
			const q = inputSearch.toLowerCase().trim();
			list = list.filter((item) => item.title.toLowerCase().includes(q));
		}

		// Sort
		if (sortBy === 'price-asc') {
			list.sort((a, b) => a.price - b.price);
		} else if (sortBy === 'price-desc') {
			list.sort((a, b) => b.price - a.price);
		}

		return list;
	});

	function resetFilters() {
		inputSearch = '';
		selectedCategory = 'all';
		sortBy = 'popular';
	}
</script>

<PrimeLayer
	bgContent=""
	title="ร้านค้าไอเทม (Item Shop)"
	subTitle="เลือกซื้อไอเทม อาวุธ และของตกแต่งสำหรับเซิร์ฟเวอร์ MineCha"
	linkPaths={[
		{
			title: 'ร้านค้า',
			link: '/shop'
		}
	]}
	icon="mdi:cart-outline"
>
	<div class="space-y-6">
		<!-- Top Bar: Search, Sort, and Quick Topup -->
		<div
			class="card rounded-2xl border border-surface-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-md dark:border-surface-700/60 dark:bg-surface-800/90 text-surface-900 dark:text-surface-50"
		>
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<!-- Search Input -->
				<div class="relative w-full md:max-w-md">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-surface-400">
						<Icon icon="mdi:magnify" class="h-5 w-5" />
					</div>
					<input
						type="text"
						bind:value={inputSearch}
						placeholder="ค้นหาชื่อไอเทม..."
						class="w-full rounded-xl border border-surface-200/80 bg-surface-50/80 py-2.5 pl-10 pr-10 text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-secondary-500 focus:bg-white focus:ring-2 focus:ring-secondary-500/20 dark:border-surface-700/80 dark:bg-surface-900/60 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-secondary-400 dark:focus:bg-surface-900"
					/>
					{#if inputSearch}
						<button
							type="button"
							onclick={() => (inputSearch = '')}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400 transition-colors hover:text-surface-700 dark:hover:text-surface-200"
							title="ล้างข้อความค้นหา"
						>
							<Icon icon="mdi:close-circle" class="h-4 w-4" />
						</button>
					{/if}
				</div>

				<!-- Sort & Topup Action -->
				<div class="flex flex-wrap items-center gap-3">
					<!-- Sort Select -->
					<div class="flex items-center gap-2">
						<span class="text-xs text-surface-500 dark:text-surface-400 hidden sm:inline">จัดเรียง:</span>
						<select
							bind:value={sortBy}
							class="rounded-xl border border-surface-200/80 bg-surface-50/80 px-3 py-2 text-xs font-medium text-surface-800 outline-none transition-all focus:border-secondary-500 dark:border-surface-700/80 dark:bg-surface-900/60 dark:text-surface-200"
						>
							<option value="popular">ยอดนิยม (ค่าเริ่มต้น)</option>
							<option value="price-asc">ราคา: ต่ำ ➔ สูง</option>
							<option value="price-desc">ราคา: สูง ➔ ต่ำ</option>
						</select>
					</div>

					<!-- Direct Topup Shortcut -->
					<a
						href="/topup"
						class="variant-filled-secondary btn btn-sm rounded-xl font-semibold shadow-sm transition-transform active:scale-95"
					>
						<Icon icon="mdi:hand-coin" class="h-4 w-4" />
						<span>เติมเงิน / รับพอยต์</span>
					</a>
				</div>
			</div>

			<!-- Category Filter Pills -->
			<div class="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-200/60 pt-4 dark:border-surface-700/60">
				<button
					type="button"
					class="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 {selectedCategory ===
					'all'
						? 'variant-filled-secondary text-white shadow-sm'
						: 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700/50 dark:text-surface-300 dark:hover:bg-surface-700'}"
					onclick={() => (selectedCategory = 'all')}
				>
					<span>ทั้งหมด</span>
					<span class="opacity-70">({data.colla.length})</span>
				</button>

				{#each data.catta as cat}
					<button
						type="button"
						class="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-150 {selectedCategory ===
						cat.title
							? 'variant-filled-secondary text-white shadow-sm'
							: 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700/50 dark:text-surface-300 dark:hover:bg-surface-700'}"
						onclick={() => (selectedCategory = cat.title)}
					>
						<span>{cat.title}</span>
						<span class="opacity-70">({cat.count})</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Status Header / Count -->
		<div class="flex items-center justify-between px-1">
			<span class="text-xs font-medium text-surface-500 dark:text-surface-400">
				แสดง <strong class="text-surface-900 dark:text-surface-100">{filteredItems.length}</strong> รายการ
			</span>
			{#if inputSearch || selectedCategory !== 'all'}
				<button
					type="button"
					onclick={resetFilters}
					class="text-xs font-semibold text-secondary-600 hover:underline dark:text-secondary-400"
				>
					ล้างตัวกรองทั้งหมด
				</button>
			{/if}
		</div>

		<!-- Products Grid (Intuitive, spacious 3-5 columns) -->
		{#if filteredItems.length > 0}
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
				{#each filteredItems as row}
					<button
						type="button"
						title={row.title}
						onclick={() => goto('/shop/' + encodeURIComponent(row.title))}
						class="card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-surface-200/80 bg-white/95 p-4 text-start shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-secondary-500/50 hover:shadow-xl dark:border-surface-700/60 dark:bg-surface-800/90 text-surface-900 dark:text-surface-50"
					>
						<!-- Image Container -->
						<div
							class="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-surface-100/70 p-4 transition-colors group-hover:bg-surface-200/60 dark:bg-surface-700/40 dark:group-hover:bg-surface-700/70"
						>
							<img
								src={row.imageUrl ? (row.imageUrl.startsWith('/') ? row.imageUrl : '/items/' + row.imageUrl) : '/items/coalore.webp'}
								alt={row.title}
								draggable="false"
								style="view-transition-name: shop-img-{row.id};"
								class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
								onerror={(e) => {
									(e.currentTarget as HTMLImageElement).src = '/items/coalore.webp';
								}}
							/>
						</div>

						<!-- Content Area -->
						<div class="mt-3 flex flex-1 flex-col justify-between space-y-3">
							<div>
								<h3
									class="line-clamp-2 text-sm font-bold text-surface-900 transition-colors group-hover:text-secondary-600 dark:text-surface-50 dark:group-hover:text-secondary-400 sm:text-base"
								>
									{row.title}
								</h3>
							</div>

							<!-- Price & Button -->
							<div class="flex items-center justify-between border-t border-surface-200/60 pt-2.5 dark:border-surface-700/60">
								<div class="flex items-baseline gap-1">
									<span class="text-sm font-extrabold text-secondary-600 dark:text-secondary-400 sm:text-base">
										${row.price.toLocaleString()}
									</span>
									<span class="text-[10px] font-medium text-surface-500 dark:text-surface-400">Point</span>
								</div>

								<span
									class="rounded-lg bg-surface-100 p-1.5 text-surface-500 transition-colors group-hover:bg-secondary-500 group-hover:text-white dark:bg-surface-700/60 dark:text-surface-300"
								>
									<Icon icon="mdi:arrow-right" class="h-4 w-4" />
								</span>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div
				class="card flex flex-col items-center justify-center rounded-2xl border border-surface-200/80 bg-white/95 p-12 text-center shadow-sm dark:border-surface-700/60 dark:bg-surface-800/90 text-surface-900 dark:text-surface-50"
			>
				<div class="rounded-2xl bg-surface-100 p-4 text-surface-400 dark:bg-surface-700/60">
					<Icon icon="mdi:package-variant-remove" class="h-10 w-10" />
				</div>
				<h3 class="mt-4 text-lg font-bold">ไม่พบสินค้าที่ตรงกับเงื่อนไข</h3>
				<p class="mt-1 text-xs text-surface-500 dark:text-surface-400 max-w-sm">
					ลองค้นหาด้วยคำอื่น หรือกดปุ่มด้านล่างเพื่อแสดงสินค้าทั้งหมด
				</p>
				<button
					type="button"
					onclick={resetFilters}
					class="variant-filled-secondary btn btn-sm mt-4 rounded-xl font-semibold shadow-sm"
				>
					<Icon icon="mdi:refresh" class="h-4 w-4" />
					<span>แสดงสินค้าทั้งหมด</span>
				</button>
			</div>
		{/if}
	</div>
</PrimeLayer>
