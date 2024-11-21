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
</script>

<!-- Content -->
<div class="container mx-auto p-2 lg:py-10">
	<div class="space-y-2">
		<div class="justify-center gap-4 space-y-2 xl:flex">
			<div class="relative duration-300 max-w-screen-lg"
			class:max-w-screen-md={curVert > 30}
			
			>
				<img
					class="border-br-2 rounded-md border-primary-500"
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
				{#each [1, 2,3] as row}
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
					class="order-2 col-span-full rounded-xl card bg-white lg:order-1 lg:col-span-3 p-3"
				>
					<div class="grid grid-cols-6 justify-center gap-4 pb-10">
						{#each data.colla as row}
							<button
								onclick={() => goto('/view/' + row.id)}
								class="col-span-3 rounded-lg hover:scale-[101%] lg:col-span-1"
							>
								<div class="card-header">
									<!-- src={'/items/' + row.imageUrl} -->

									<img
										src={row.imageUrl}
										draggable="false"
										class="w-96 duration-100 active:scale-105"
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
				<div class="order-1 lg:order-2 col-span-full lg:col-span-1">
					<div class="card bg-white p-3 dark:text-white">
						<div class="text-2xl font-semibold p-5">Menu</div>
						<nav class="list-nav">
							<ul>
								<li>
									<a href="/">
										<Icon icon="lucide:house" width="1.2em" height="1.2em" />
										<span class="flex-auto">หน้าหลัก</span>
									</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
