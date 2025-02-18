<script lang="ts">
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	let formSearch: HTMLFormElement;

	let inputSearch = $state('');

	let selectedCategory = $state('all');

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let colla = $state(data.colla);
	let catta = $state(data.catta);
</script>

<PrimeLayer
	bgContent=""
	title="Shop Items"
	subTitle="รายการสินค้า"
	linkPaths={[
		{
			title: 'ร้านค้า',
			link: ''
		}
	]}
>
	<div class="">
		<!-- Search and Filter Section -->
		<div class="mb-8 space-y-4">
			<!-- Search Input -->
			<div class="flex max-w-md gap-2">
				<form
					bind:this={formSearch}
					method="POST"
					action="?/searchItem"
					use:enhance={({ formElement, formData, action, cancel }) => {
						return async ({ result }) => {
							console.log(result);
							if (result.type === 'failure') {
								console.log('Error: ' + result.status);
							}
							if (result.type === 'success') {
								if (
									Array.isArray(result.data) &&
									result.data.every((item) => 'id' in item && 'title' in item && 'price' in item)
								) {
									colla = result.data.map(({ id, title, price, imageUrl }) => ({
										id,
										title,
										price,
										imageUrl
									}));
									console.log('Res D', colla);
								}
								console.log('SUCCESS');
							} else {
								console.error('Invalid data or fetch failure');
							}
							await applyAction(result);
						};
					}}
				>
					<input
						autocomplete="off"
						name="title"
						type="text"
						bind:value={inputSearch}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								formSearch.requestSubmit();
							}
						}}
						placeholder="🔍ค้นหาไอเทม..."
						class="input-white"
					/>
					<button hidden type="submit">Search</button>
				</form>
				<button
					class="-ml-12 text-surface-400"
					type="button"
					onclick={(e) => {
						e.stopPropagation();
						inputSearch = '';
						colla = data.colla;
					}}
					title="Clear"
				>
					ล้าง
				</button>
			</div>

			<!-- Category Selection -->
			<div class="flex flex-wrap gap-2">
				{#each catta as cat}
					<button
						class="rounded-full p-2 px-3 {selectedCategory === cat.title
							? 'bg-primary-500 text-white'
							: 'bg-gray-200 text-gray-700'} transition-opacity hover:opacity-90 text-sm"
						onclick={() => (selectedCategory = cat.title)}
					>
						{cat.title}
					</button>
				{/each}
			</div>
		</div>

		<!-- Products Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each colla as row}
				<button
					title={row.title}
					onclick={() => goto('/shop/' + encodeURIComponent(row.title))}
					class="overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
				>
					<img
						src="/items/coalore.webp"
						alt={row.title}
						draggable="false"
						class="w-full rounded-md p-3 duration-100 active:scale-105"
					/>
					<div class="p-4">
						<h3 class="mb-2 font-semibold text-surface-400">{row.title}</h3>
						<p class="text-surface-600-300-token mb-2">${row.price.toFixed(2)}</p>
						<!-- <button
							class="w-full rounded-lg bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
						>
							Add to Cart
						</button> -->
					</div>
				</button>
			{/each}
		</div>

		<!-- No Results Message -->
		{#if form?.notFound}
			<p>Item Not Found</p>
		{/if}
	</div>
</PrimeLayer>
