<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import PrimeLayer from '$lib/Widgets/PrimeLayer.svelte';
	const { data }: { data: PageData } = $props();
	let curVert = $state<number>(0);
	function handleScroll() {
		curVert = window.scrollY;
	}
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<PrimeLayer
	bgContent=""
	title=""
	subTitle=""
	linkPaths={[
		{
			title: 'ร้านค้า',
			link: ''
		}
	]}
	icon={'mdi:house'}
>
	<!-- Content -->
	<div class="">
		<div class="xl:flex justify-center items-center">
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
						<div class="text-2xl font-semibold">Frutiger Aero</div>
						<div class="italic">
							Wake up! its 2000 now
							{curVert}
						</div>
					</div>
				</div>
			</div>


			<div class="grid min-w-96 text-center bg-surface-500">
				<!-- Topup No1 -->
				<div class="h-full min-h-32 w-full text-center shadow-md">
					<div class="flex h-full flex-col items-center justify-center text-white">
						<h1>🏆Player</h1>
						<h5 class="font-bold">เป็นผู้สนับสนุนอันดับหนึ่ง</h5>
					</div>
				</div>
				<!-- --- -->
				<hr class="hr mx-4" />
				<!-- --- -->
				<!-- Online Ingame -->
				<a
					href="#topOnline"
					class="h-full min-h-32 w-full text-center no-underline shadow-md"
				>
					<div class="flex h-full flex-col items-center justify-center text-white">
						<h1>🕛Player</h1>
						<h5 class="font-bold">ออนไลน์สูงสุด 10 ชั่วโมง</h5>
					</div>
				</a>
				<!-- --- -->
				<hr class="hr mx-4" />
				<!-- --- -->
				<div class="h-full min-h-32 w-full text-center shadow-md">
					<div class="flex h-full flex-col items-center justify-center text-white">
						<div class="text-3xl" class:text-error-400={data.pAll === 'เซิร์ฟเวอร์ออฟไลน์'}>
							{data.pAll}
						</div>
						{#if data.pAll != 'เซิร์ฟเวอร์ออฟไลน์'}
							<h5 class="font-bold">ผู้เล่นออนไลน์</h5>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="container mx-auto space-y-8 pt-16">
			<!-- <div class="grid grid-cols-3 gap-4 h-96 bg-black">

				{#each [1,2,3] as row}
				<div class="bg-white rounded-lg">Card</div>
				{/each}
			</div> -->
			<article class="prose-sm">
				<div class="grid justify-center text-center">
					<div>
						<h1>Prologue</h1>
					</div>
					<h5>The Legend's Reincarnate</h5>
				</div>
			</article>

			<div class="">
				<article id="topOnline" class="xl:prose-md prose-sm">
					<h1>⌚อันดับเวลาผู้เล่นออนไลน์สะสมสูงสุด</h1>
				</article>
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
</PrimeLayer>
