<script lang="ts">
	import { sideBarList } from '$lib/variableStore';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import type { LinkPath } from '$lib/variableStore/interModels';

	let currentPath = $state('');
	let isContracted = $state(false);

	$effect(() => {
		currentPath = $page.url.pathname;
	});

	let {
		title,
		subTitle,
		linkPaths,
		children,
		bgContent = 'card bg-white/95 dark:bg-surface-800/90 text-surface-900 dark:text-surface-50 border border-surface-200/60 dark:border-surface-700/60 shadow-md p-4',
		icon,
		menuGap = 'gap-4'
	}: {
		title?: String;
		subTitle?: string;
		linkPaths?: LinkPath[];
		children: any;
		bgContent?: string;
		icon?: string;
		menuGap?: string;
	} = $props();

	const activePath = (targetPath: string) => {
		if (targetPath === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(targetPath + '/') || currentPath === targetPath;
	};
</script>

<main>
	<div class="min-h-screen lg:pt-8">
		<div class="xl:flex {menuGap}">
			<div class="order-1 col-span-3 w-full space-y-4 xl:order-2">
				{#if title}
					<div class="border-line border border-surface-200/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-surface-700/60 dark:bg-surface-800/80">
						<div class="flex items-center gap-4">
							{#if icon}
								<div class="rounded-xl bg-secondary-500/10 p-3 text-secondary-500 dark:bg-secondary-500/20">
									<Icon {icon} width="36" height="36" />
								</div>
							{/if}
							<div class="space-y-1">
								<h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">{title}</h1>
								{#if subTitle}
									<p class="text-sm text-surface-500 dark:text-surface-400">{subTitle}</p>
								{/if}
							</div>
						</div>
					</div>
				{/if}
				<div class="{bgContent} col-span-full rounded-xl duration-200">
					{@render children()}
				</div>
			</div>

			<!-- Menu (Collapsible & High-contrast dark mode) -->
			<div
				class="sticky top-0 order-2 flex-grow-0 transition-all duration-200 max-lg:hidden xl:order-1 {isContracted
					? 'w-16 min-w-16'
					: 'w-64 min-w-64'}"
			>
				<div
					class="fixed left-2 top-32 z-20 space-y-2 transition-all duration-200 {isContracted
						? 'w-16'
						: 'w-60'}"
				>
					<div
						class="flex items-center justify-between rounded-xl border border-surface-200/80 bg-white/95 p-3 text-surface-900 shadow-md backdrop-blur-md transition-all duration-200 dark:border-surface-700/60 dark:bg-surface-800/90 dark:text-surface-50"
					>
						{#if !isContracted}
							<span class="text-xs font-bold tracking-wider text-surface-700 dark:text-surface-300">
								MINECHA | เมนู
							</span>
						{/if}
						<button
							type="button"
							class="rounded-lg p-1 text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-700/60 dark:hover:text-surface-100 {isContracted
								? 'mx-auto'
								: ''}"
							onclick={() => (isContracted = !isContracted)}
							title={isContracted ? 'ขยายเมนู' : 'ย่อเมนู'}
							aria-label={isContracted ? 'ขยายเมนู' : 'ย่อเมนู'}
						>
							<Icon
								icon={isContracted ? 'mdi:chevron-double-right' : 'mdi:chevron-double-left'}
								class="h-5 w-5"
							/>
						</button>
					</div>

					<div
						class="rounded-xl border border-surface-200/80 bg-white/95 p-3 text-surface-900 shadow-md backdrop-blur-md transition-all duration-200 dark:border-surface-700/60 dark:bg-surface-800/90 dark:text-surface-50"
					>
						<div class="flex flex-col space-y-1">
							{#each sideBarList as row}
								<button
									class="flex w-full items-center gap-3 rounded-lg p-2.5 text-start transition-all duration-150 {activePath(
										row.goto
									)
										? 'variant-filled-secondary font-bold text-white shadow-sm'
										: 'text-surface-700 hover:bg-surface-200/70 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-700/60 dark:hover:text-surface-50'} {isContracted
										? 'justify-center'
										: ''}"
									type="button"
									title={row.title}
									onclick={() => {
										if (row.goto) goto(row.goto);
									}}
								>
									<Icon icon={row.icon} class="h-6 w-6 shrink-0" />
									{#if !isContracted}
										<span class="truncate text-sm">{row.title}</span>
									{/if}
								</button>
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
		border-bottom-right-radius: 40px;
	}
</style>
