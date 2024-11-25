<script lang="ts">
	import { goto } from '$app/navigation';
	import ActionCard from '$lib/Widgets/ActionCard.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	let { data } = $props();
	// console.log(data)
	let curVert = $state(0);
	function handleScroll() {
		curVert = window.scrollY;
	}
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
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

			<div class="flex items-center justify-center gap-2 xl:grid">
				{#each [1, 2, 3] as row}
					<ActionCard text={row} />
				{/each}
			</div>
		</div>
		<div class="container mx-auto space-y-4">
			<div class="p-2"></div>
			<!-- <div class="alert flex justify-center text-2xl">สินค้ายอดนิยม</div>
			<div
				class="grid grid-cols-6 p-2 lg:p-10 bg-white bg-opacity-80 pb-10 dark:bg-opacity-10 lg:rounded-full"
			>
				{#each data.colla as row}
					<button
						onclick={() => goto('/view/' + row.id)}
						class="col-span-2 rounded-lg hover:scale-[101%] lg:col-span-2"
					>
						<div class="card-header flex justify-center">
							<img
								draggable="false"
								class="w-64 duration-100 active:scale-105"
								src={'/items/' + row.imageUrl}
								alt="1"
							/>
						</div>
						<div class="card-footer grid justify-center p-4 text-surface-400">
							<div>{row.title}</div>
							<div class="text-surface-400">{row.price}$</div>
						</div>
					</button>
				{/each}
			</div> -->
			<div class="alert flex justify-center text-2xl">เลือกดูสินค้าตามใจชอบ💖</div>
			<div class="grid grid-cols-4 gap-4">
				<div
					class="card order-2 col-span-full rounded-xl bg-white p-3 duration-200 hover:shadow-md xl:order-1 xl:col-span-3"
				>
					<!-- Filter -->
					<div class="flex justify-between p-3 dark:text-white">
						<!-- <div class="font-noto text-xl">รายการสินค้า</div> -->
						<div class="relative z-10">
							<div class="sticky bottom-10">
								<input
									bind:value={inputSearch}
									class="input border-2 border-surface-100 bg-white p-3"
									type="text"
									placeholder="🔍ค้นหาไอเทม"
								/>
								<div class="absolute right-0 top-0 ">
									<button
										title="Clear Text"
										onclick={() => (inputSearch = '')}
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
						class="max-h-[80dvh] gap-4 overflow-y-auto pb-10"
						class:grid={isGrid}
						class:grid-cols-6={isGrid}
					>
						{#each data.colla as row}
							<button
								onclick={() => goto('/view/' + row.id)}
								class="col-span-3 rounded-lg hover:scale-[101%] lg:col-span-1"
								class:flex={!isGrid}
							>
								<div class="card-header">
									<!-- src={'/items/' + row.imageUrl} -->
									<img
										src={row.imageUrl}
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
							<div class="text-2xl font-semibold">หมวดหมู่</div>
							<div class="text-sm font-light">เลือกหมวดหมู่สินค้า</div>
						</div>
						<hr class="!border-t-2" />
						<!-- <div class="text-surface-300">ประเภทสินค้า</div> -->
						<nav class="list-nav py-2">
							<ul>
								<li>
									<a href="/">
										<Icon icon="lucide:crown" width="1.2em" height="1.2em" />
										<span class="flex-auto">สินค้าขายดี</span>
									</a>
								</li>
							</ul>
						</nav>
						<nav class="list-nav py-2">
							<ul>
								<li>
									<a href="/">
										<Icon icon="lucide:crosshair" width="1.2em" height="1.2em" />

										<span class="flex-auto">โปรโมชั่นพิเศษ</span>
									</a>
								</li>
							</ul>
						</nav>

						{#each [1, 2, 3] as row}
							<nav class="list-nav py-2">
								<ul>
									<li>
										<a href="/">
											<Icon icon="lucide:container" width="1.2em" height="1.2em" />
											<span class="flex-auto">Item</span>
										</a>
									</li>
								</ul>
							</nav>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
