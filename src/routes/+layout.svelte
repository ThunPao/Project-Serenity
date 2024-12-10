<script lang="ts">
	import Navido from '$lib/Magic/Navido.svelte';
	import NaviNim from '$lib/Magic/NaviNim.svelte';

	import NavBottom from '$lib/Widgets/NavBottom.svelte';
	import NavTop from '$lib/Widgets/NavTop.svelte';
	import ProfilePop from '$lib/Widgets/ProfilePop.svelte';
	// import FooterBar from '$lib/Widgets/FooterBar.svelte';

	import { page } from '$app/stores';
	import { initializeStores, Drawer, Toast, getDrawerStore, getToastStore } from '@skeletonlabs/skeleton';
	import '../app.css';
	initializeStores();

	let { children } = $props();
	const drawerStore = getDrawerStore();
	export const toastStore = getToastStore();
</script>

<main data-theme="julia" class="bg-surface-50-900-token select-none font-noto">
	<Navido />
	<NaviNim />
	<Toast />
	<Drawer>
		{#if $drawerStore.id === 'ProfilePop'}
			<ProfilePop session={$page.data.session ? $page.data.session : null} isOnline={$page.data.isOnline}  />
		{/if}
	</Drawer>
	<NavTop session={$page.data.session ? $page.data.session : null} isOnline={$page.data.isOnline}/>
	{@render children()}
	<NavBottom />
</main>
