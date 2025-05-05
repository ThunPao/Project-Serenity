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
		icon,
		menuGap = "gap-4"
	}: {
		title: String;
		subTitle: string;
		linkPaths: LinkPath[];
		children: any;
		bgContent?: string;
		icon?: string;
		menuGap?: string;
	} = $props();
	const activePath = (targetPath: string) => {
	if (targetPath === '/') {
		return currentPath === '/';
	}
	return currentPath.startsWith(targetPath + '/')
		|| currentPath === targetPath;
};

</script>

<!-- <style>
	main {
		background-image: url("/background/bgcover.webp");
		background-size: cover;
	}
</style> -->
<main>
	<div class="min-h-screen lg:pt-8">
		<div class="xl:flex {menuGap}">
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
			<!-- Menu -->
			<div class="sticky top-0 order-2 min-w-64 flex-grow-0 max-lg:hidden xl:order-1">
				<div class="fixed left-2 top-40 space-y-2">
					<div class="menucard">SERENITY | เมนู</div>
					<div class="menucard">
						<!-- <div class="p-4">
							<div class="text-2xl font-semibold">Menu</div>
							<div class="text-sm font-light">Lorem ipsum dolor sit amet.</div>
						</div> -->
						<hr class="!border-t-2 opacity-40" />
						<div class="flex flex-col space-y-2 rounded-lg px-3 py-2">
							{#each sideBarList as row, index}
								<button
									class="inline-flex w-full items-center gap-2 rounded-lg border-white p-2 text-start duration-100 active:variant-filled-secondary hover:border-2"
									type="button"
									class:variant-filled-secondary={activePath(row.goto)}
									class:text-base={activePath(row.goto)}
									class:font-bold={activePath(row.goto)}
									class:text-sm={currentPath != row.goto}
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
	</div>
</main>

<style>
	.border-line {
		border-bottom-right-radius: 80px;
	}
	.menucard {
		@apply bg-white p-3 shadow-lg duration-200 max-xl:variant-glass-surface hover:shadow-md max-xl:text-surface-100;
	}
</style>
