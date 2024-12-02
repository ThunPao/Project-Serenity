<script lang="ts">
	import { goto } from '$app/navigation';
	import ActionCard from '$lib/Widgets/ActionCard.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { sideBarList } from '$lib/variableStore/index.ts';
	import { enhance, applyAction } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let colla = $state(data.colla);
	let curVert = $state<number>(0);
	let curSideTabIndex = $state(0);

	function handleScroll() {
		curVert = window.scrollY;
	}
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	let isGrid = $state(true);
	let inputSearch = $state('');
</script>

<!-- Content -->
<div class="container mx-auto lg:p-2 lg:py-10">
	<div class="space-y-2">
		<div class="justify-center gap-4 space-y-2 xl:flex">
			<div class="relative max-w-screen-lg duration-300" class:xl:max-w-screen-md={curVert > 30}>
				<img
					class="border-br-2 border-primary-500 lg:rounded-md"
					src="/background/bg.webp"
					alt=""
					width="1024"
					height="500"
					draggable="false"
				/>
				<div
					class="z-1 absolute bottom-0 w-full rounded-b-lg bg-gradient-to-t from-surface-600 from-40% to-transparent text-white"
				>
					<div class="p-2 pl-4">
						<div class="text-2xl font-semibold">Example</div>
						<div class="italic">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, necessitatibus.
							{curVert}
						</div>
					</div>
				</div>
			</div>

			<div class="grid min-w-96 gap-2 overflow-x-auto">
				<!-- Topup No1 -->
				<div class="btn h-full min-h-32 w-full bg-surface-500 text-center shadow-md">
					<div class="flex h-full flex-col items-center justify-center text-white">
						<h1>🏆Player</h1>
						<h5 class="font-bold">เป็นผู้สนับสนุนอันดับหนึ่ง</h5>
					</div>
				</div>
				<!-- Online Ingame -->
				<a
					href="#topOnline"
					class="btn h-full min-h-32 w-full bg-surface-500 text-center no-underline shadow-md"
				>
					<div class="flex h-full flex-col items-center justify-center text-white">
						<h1>🕛Player</h1>
						<h5 class="font-bold">ออนไลน์สูงสุด 10 ชั่วโมง</h5>
					</div>
				</a>
				<!--  -->
				<!-- Online -->
				<div class="btn h-full min-h-32 w-full bg-surface-500 text-center shadow-md">
					<div class="flex h-full flex-col items-center justify-center text-white">
						<h1>🍀10</h1>
						<h5 class="font-bold">ผู้เล่นออนไลน์</h5>
					</div>
				</div>
				<!--  -->
			</div>
		</div>
		<div class="container mx-auto space-y-12">
			<div class="hidden p-2 lg:block"></div>
			<!-- <div class="alert flex justify-center text-2xl">เลือกดูสินค้าตามใจชอบ💖</div> -->
			<div class="grid grid-cols-4 gap-4">
				<div
					class="card order-2 col-span-full rounded-xl bg-white p-3 duration-200 hover:shadow-md xl:order-1 xl:col-span-3"
				>
					<!-- Filter -->
					<div class="flex justify-between p-3 dark:text-white">
						<!-- <div class="font-noto text-xl">รายการสินค้า</div> -->
						<div class="relative z-10">
							<div class="sticky bottom-10">
								<form
									method="POST"
									action="?/searchItem"
									use:enhance={({ formElement, formData, action, cancel }) => {
										return async ({ result }) => {
											if (result.type === 'success') {
												colla = result.data;
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
									<button hidden title="Submit" type="submit">Send</button>
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
								onclick={() => goto('/view/' + row.id)}
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
				</div>
				<div class="order-1 col-span-full xl:order-2 xl:col-span-1">
					<div class="card bg-white p-3 duration-200 hover:shadow-md dark:text-white">
						<div class="p-4">
							<div class="text-2xl font-semibold">SERENITY SHOP</div>
							<div class="text-sm font-light">Lorem ipsum dolor sit amet.</div>
						</div>
						<hr class="!border-t-2 opacity-40" />
						<div class="flex flex-col space-y-2 rounded-lg p-3 py-2">
							{#each sideBarList as row, index}
								<button
									class="inline-flex w-full items-center gap-2 rounded-lg p-2 text-start duration-100"
									type="button"
									class:bg-surface-50-900-token={curSideTabIndex === index}
									class:text-base={curSideTabIndex === index}
									class:font-bold={curSideTabIndex === index}
									class:text-sm={curSideTabIndex !== index}
									onclick={() => {
										curSideTabIndex = index;
									}}
								>
									<!-- onclick={() => {
									curCat = index;
									selectedCategory = row.cat;
									setFilter({ cat: row.cat });
								}} -->
									<Icon icon={row.icon} width="1.5em" height="1.5em" />
									<span class="flex-auto">{row.title}</span>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<div id="topOnline" class="text-center">
				<h1>อันดับเวลาผู้เล่นออนไลน์สะสมสูงสุด</h1>
			</div>
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{#each [1, 2, 3] as row}
					<div class="card w-full bg-white">
						<div class="card-header">
							<div class="py-4 text-center">
								<h1>No.{row}</h1>
								<h3>Player</h3>
							</div>

							<img
								src="https://cdn.pixabay.com/photo/2020/12/10/11/07/creeper-5819992_960_720.png"
								alt="1"
							/>
						</div>
						<h3 class="card-footer py-4 text-center">"Lorem ipsum dolor sit amet."</h3>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
