<script lang="ts">
	import Navido from '$lib/Magic/Navido.svelte';
	import NaviNim from '$lib/Magic/NaviNim.svelte';

	import NavBottom from '$lib/Widgets/NavBottom.svelte';
	import NavTop from '$lib/Widgets/NavTop.svelte';
	import ProfilePop from '$lib/Widgets/ProfilePop.svelte';
	import FooterBar from '$lib/Widgets/FooterBar.svelte';

	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import {
		initializeStores,
		Drawer,
		Toast,
		getDrawerStore,
		getToastStore
	} from '@skeletonlabs/skeleton';
	import '../app.css';
	import type { UserSession } from '$lib/variableStore/interModels';
	import MaintenancePage from '../lib/Components/MaintenancePage.svelte';
	initializeStores();

	let { children } = $props();
	const drawerStore = getDrawerStore();
	export const toastStore = getToastStore();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	const usrSession: UserSession | null = $page.data.session?.user
		? {
				name: $page.data.session.user.name,
				image: $page.data.session.user.image,
				points: $page.data.session.user.points ?? 0,
				coins: $page.data.session.user.coins ?? 0
			}
		: null;
</script>

{#if !$page.data.isBusy}
	<!-- bg-surface-50-900-token -->

	<main data-theme="julia" class="font-noto">
		<Toast position="tr" />
		<Navido />
		<NaviNim />
		<Drawer>
			{#if $drawerStore.id === 'ProfilePop'}
				<ProfilePop />
			{/if}
		</Drawer>
		<NavTop />
		{@render children()}
		<NavBottom />
		<FooterBar />
	</main>
{:else}
	<MaintenancePage />
{/if}
