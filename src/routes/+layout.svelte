<script lang="ts">
	import Navido from '$lib/Magic/Navido.svelte';
	import NaviNim from '$lib/Magic/NaviNim.svelte';
	// import FooterBar from '$lib/Widgets/FooterBar.svelte';
	import NavBottom from '$lib/Widgets/NavBottom.svelte';
	import NavTop from '$lib/Widgets/NavTop.svelte';
	import { page } from '$app/stores';

	import '../app.css';
	let { children } = $props();
	import { initializeStores, Drawer } from '@skeletonlabs/skeleton';
	import ProfilePop from '$lib/Widgets/ProfilePop.svelte';
	initializeStores();
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
</script>

<main data-theme="julia" class="bg-surface-50-900-token select-none font-noto">
	<Navido />
	<NaviNim />
	<Drawer>
		{#if $drawerStore.id === 'ProfilePop'}
			<ProfilePop session={$page.data.session ? $page.data.session : null} />
		{/if}
	</Drawer>
	<NavTop />
	{@render children()}
	<NavBottom />
</main>
