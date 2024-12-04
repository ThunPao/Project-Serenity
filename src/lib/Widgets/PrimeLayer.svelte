<script>
	import { sideBarList } from '$lib/variableStore';
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	let currentPath = $state('');
	$effect(() => {
		currentPath = $page.url.pathname;
	});
	let { title = '', subTitle = '', linkPaths = [], children } = $props();
</script>

<div class="container mx-auto pt-8">
	<div class="grid gap-4 xl:grid-cols-4">
		<div class="order-2 space-y-4 xl:order-1 xl:col-span-3">
			{#if title}
				<div class="rounded-md bg-white p-6">
					<ol class="breadcrumb">
						{#each linkPaths as data}
							<li class="crumb"><a class="anchor" href="/elements/breadcrumbs">{data}</a></li>
							<li class="crumb-separator" aria-hidden="true">/</li>
							<li class="crumb"><a class="anchor" href="/elements/breadcrumbs">Blog</a></li>
							<li class="crumb-separator" aria-hidden="true">/</li>
							<li>Article</li>
						{/each}
					</ol>

					<article class="prose lg:prose-xl py-4">
						<h2>{title}</h2>
					</article>
					<div class="text-lg">{subTitle}</div>
				</div>
			{/if}
			<div class="card col-span-full rounded-xl bg-white p-3 duration-200 hover:shadow-md">
				{@render children()}
			</div>
		</div>
		<!-- มุมขวา -->
		<div class="order-1 col-span-full xl:order-2 xl:col-span-1">
			<div class="card bg-white p-3 duration-200 hover:shadow-md dark:text-white">
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
							<Icon icon={row.icon} width="1.5em" height="1.5em" />
							<span class="flex-auto">{row.title}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
