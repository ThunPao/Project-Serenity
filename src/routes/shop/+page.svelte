<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { enhance, applyAction } from '$app/forms';
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	import type { ActionData, PageData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	let colla = $state(data.colla);
	let isGrid = $state(true);
	let inputSearch = $state('');
</script>

<PrimeLayer
	title="Shop Items"
	subTitle="รายการสินค้า"
	linkPaths={[
		{
			title: 'ร้านค้า',
			link: ''
		}
	]}
>
	<!-- Filter -->
	<div class="flex justify-between p-3 dark:text-white">
		<!-- <div class="font-noto text-xl">รายการสินค้า</div> -->
		<div class="relative z-10">
			<div class="sticky bottom-10">
				Cat
				{#each data.catta as cat}
					<div class="badge">
						{cat.title} ({cat.count})
					</div>
				{/each}
				<form
					method="POST"
					action="?/searchItem"
					use:enhance={({ formElement, formData, action, cancel }) => {
						return async ({ result }) => {
							console.log(result);
							if (result.type === 'failure') {
								console.log('Error: ' + result.status);
							}
							if (
								result.type === 'success' &&
								Array.isArray(result.data) &&
								result.data.every((item) => 'id' in item && 'title' in item && 'price' in item)
							) {
								colla = result.data.map(({ id, title, price }) => ({ id, title, price }));
								console.log('Res D', colla);
							} else {
								console.error('Invalid data or fetch failure');
							}
							await applyAction(result);
						};
					}}
				>
					<input
						bind:value={inputSearch}
						class="input border-2 border-surface-100 bg-white p-3"
						type="text"
						name="title"
						placeholder="🔍ค้นหาไอเทม"
					/>
					<button title="Submit" type="submit">Send</button>
					{#if form?.notFound}
						<p>Item Not Found</p>
					{/if}
				</form>

				<div class="absolute right-0 top-0">
					<button
						title="Clear Text"
						onclick={() => {
							inputSearch = '';
							colla = data.colla;
						}}
						class:hidden={inputSearch.length < 3}
						class="flex h-full select-none items-center p-3 text-surface-300">ล้าง</button
					>
				</div>
			</div>
		</div>

		<div class="group text-surface-300 hover:text-surface-500">
			<button
				title="Toggle Grid/List View"
				class="duration-200 group-hover:scale-105 group-active:scale-125"
				onclick={() => {
					isGrid = !isGrid;
				}}
			>
				<Icon
					icon={`lucide:${isGrid ? 'grid-2x2' : 'layout-list'}`}
					width="1.75em"
					height="1.75em"
				/>
			</button>
		</div>
	</div>
	<!-- Item -->
	<div
		class="max-h-[80dvh] gap-4 overflow-hidden overflow-y-auto pb-10"
		class:grid={isGrid}
		class:grid-cols-6={isGrid}
	>
		{#each colla as row}
			<button
				onclick={() => goto('/shop/' + row.id)}
				class="col-span-3 rounded-lg hover:scale-[101%] lg:col-span-1"
				class:flex={!isGrid}
			>
				<div class="card-header">
					<!-- src={'/items/' + row.imageUrl} -->
					<!-- src={row.imageUrl} -->

					<img
						src="/items/coalore.webp"
						draggable="false"
						class="rounded-md duration-100 active:scale-105"
						alt="1"
					/>
				</div>
				<div class="card-footer grid justify-center p-4 text-surface-400">
					<div>{row.title}</div>
					<div class="text-surface-400">{row.price}$</div>
				</div>
			</button>
		{/each}
	</div>
</PrimeLayer>
