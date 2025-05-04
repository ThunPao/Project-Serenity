<script lang="ts">
	import { sideBarList } from '$lib/variableStore';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import type { LinkPath } from '$lib/variableStore/interModels';
	let currentPath = $state('');
	$effect(() => {
		currentPath = $page.url.pathname;
	});

	let {
		title,
		subTitle,
		linkPaths,
		children,
		bgContent = 'card bg-white hover:shadow-md p-3',
		icon
	}: {
		title: String;
		subTitle: string;
		linkPaths: LinkPath[];
		children: any;
		bgContent?: string;
		icon?: string;
	} = $props();
</script>

<!-- <style>
	main {
		background-image: url("/background/bgcover.webp");
		background-size: cover;
	}
</style> -->
<main>
	<div class="container min-h-screen lg:pt-8">
		<div class="flex gap-8">
			<div class="order-1 col-span-3 w-full space-y-4 xl:order-2">
				{#if title}
					<div class="border-line">
						<!-- bg-gradient-to-r from-tertiary-500 to-primary-500 p-4 pr-40 text-white -->
						<div class="flex items-center gap-4">
							<!-- {#if icon}
								<Icon {icon} width="50" height="50" />
							{/if} -->
							<div class="space-y-2 p-6">
								<article class="prose-lg">
									<h1>{title}</h1>
								</article>
								<p class="text-surface-400">{subTitle}</p>
							</div>
						</div>
					</div>
				{/if}
				<div class="{bgContent} col-span-full rounded-xl duration-200">
					{@render children()}
				</div>
			</div>
			<!-- มุมขวา -->
			<div class="order-2 min-w-64 flex-grow-0 max-lg:hidden xl:order-1">
				<div class="card bg-white p-3 shadow-lg duration-200 hover:shadow-md">
					<div class="p-4">
						<div class="text-2xl font-semibold">Menu</div>
						<div class="text-sm font-light">Lorem ipsum dolor sit amet.</div>
					</div>
					<hr class="!border-t-2 opacity-40" />
					<div class="flex flex-col space-y-2 rounded-lg p-3 py-2">
						{#each sideBarList as row, index}
							<button
								class="inline-flex w-full items-center gap-2 rounded-lg p-2 text-start duration-100 hover:bg-surface-100"
								type="button"
								class:bg-surface-50-900-token={currentPath === row.goto}
								class:text-base={currentPath === row.goto}
								class:font-bold={currentPath === row.goto}
								class:text-sm={currentPath !== row.goto}
								onclick={() => {
									if (row.goto) goto(row.goto);
								}}
							>
								<Icon icon={row.icon} width="2.5em" height="2.5em" />
								<span class="flex-auto">{row.title}</span>
							</button>
							<hr class="mx-4 bg-surface-50 opacity-40" />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.border-line {
		border-bottom-right-radius: 80px;
	}
</style>
