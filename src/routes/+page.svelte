<script lang="ts">
	import { goto } from '$app/navigation';
	import ActionCard from '$lib/Widgets/ActionCard.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
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
<div class="container mx-auto p-2 py-10">
	<div class="space-y-2">
		<div class="gap-4 space-y-2 xl:flex">
			<div class="relative">
				<img
					class="border-br-2 rounded-md border-primary-500 max-w-screen-lg duration-200"
					class:max-w-screen-md={curVert > 30}
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

			<div class="grid justify-center gap-4 pb-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{#each data.colla as row}
					<button onclick={() => goto('/view/' + row.id)} class="card-hover rounded-lg">
						<div class="card-header">
							<img
								draggable="false"
								class="w-96 duration-100 active:scale-105"
								src={'/items/' + row.imageUrl}
								alt="1"
							/>
						</div>
						<div class="card-footer flex justify-between p-4 text-surface-400">
							<div>Title</div>
							<div>Content</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
