<script lang="ts">
	import Navido from '$lib/Magic/Navido.svelte';
	import NaviNim from '$lib/Magic/NaviNim.svelte';

	import NavBottom from '$lib/Widgets/NavBottom.svelte';
	import NavTop from '$lib/Widgets/NavTop.svelte';
	import ProfilePop from '$lib/Widgets/ProfilePop.svelte';
	import FooterBar from '$lib/Widgets/FooterBar.svelte';

	import { page } from '$app/stores';
	import { initializeStores, Drawer, Toast, getDrawerStore, getToastStore } from '@skeletonlabs/skeleton';
	import '../app.css';
	import type { UserSession } from '$lib/variableStore/interModels';
	initializeStores();

	let { children } = $props();
	const drawerStore = getDrawerStore();
	export const toastStore = getToastStore();

	const usrSession: UserSession | null = $page.data.session?.user
    ? {
        name: $page.data.session.user.name,
        image: $page.data.session.user.image,
        points: $page.data.session.user.points ?? 0,
        coins: $page.data.session.user.coins ?? 0,
      }
    : null;

</script>
<!-- bg-surface-50-900-token -->
<main data-theme="julia" class=" select-none font-noto">
	<Navido />
	<NaviNim />
	<Toast />
	<Drawer>
		{#if $drawerStore.id === 'ProfilePop'}
			<ProfilePop usrSession={usrSession} isOnline={$page.data.isOnline}  />
		{/if}
	</Drawer>
	<NavTop usrSession={usrSession} isOnline={$page.data.isOnline}/>
	{@render children()}
	<NavBottom usrSession={usrSession} isOnline={$page.data.isOnline} />
	<FooterBar/>
</main>
