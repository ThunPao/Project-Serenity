<script lang="ts">
	import { onMount } from 'svelte';
	let curVert = $state<number>(0);

	function handleScroll() {
		curVert = window.scrollY;
	}
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
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
			
			<div id="topOnline" class="pt-4 text-center">
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
